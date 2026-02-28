from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import settings
import logging
import asyncio
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

# Real MongoDB client placeholders
client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None


class InMemoryCollection:
    def __init__(self):
        self._data: List[Dict[str, Any]] = []
        self._id_counter = 1

    async def insert_one(self, doc: Dict[str, Any]):
        oid = str(self._id_counter)
        self._id_counter += 1
        stored = dict(doc)
        stored["_id"] = oid
        self._data.append(stored)
        class Result:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return Result(inserted_id=oid)

    def find(self, query: Dict[str, Any] = None):
        # Return an async cursor-like object with to_list
        query = query or {}
        filtered = []
        for d in reversed(self._data):
            matches = True
            if "$or" in query:
                matches = False
                for cond in query["$or"]:
                    for k, v in cond.items():
                        if isinstance(v, dict) and "$regex" in v:
                            if v["$regex"].lower() in (d.get(k) or "").lower():
                                matches = True
                                break
                    if matches:
                        break
            else:
                for k, v in query.items():
                    if d.get(k) != v:
                        matches = False
                        break
            if matches:
                filtered.append(d)

        class Cursor:
            def __init__(self, data):
                self._data = data
            def sort(self, *_args, **_kwargs):
                return self
            async def to_list(self, length: int):
                if length == 0:
                    return self._data
                return self._data[:length]

        return Cursor(filtered)

    async def find_one(self, query: Dict[str, Any]):
        for d in reversed(self._data):
            ok = True
            for k, v in query.items():
                if d.get(k) != v:
                    ok = False
                    break
            if ok:
                return d
        return None

    async def delete_one(self, query: Dict[str, Any]):
        for i, d in enumerate(self._data):
            match = True
            for k, v in query.items():
                if k == "_id":
                    if str(d.get("_id")) != str(v):
                        match = False
                        break
                elif d.get(k) != v:
                    match = False
                    break
            if match:
                del self._data[i]
                class Result:
                    def __init__(self, deleted_count):
                        self.deleted_count = deleted_count
                return Result(deleted_count=1)
        class Result:
            def __init__(self, deleted_count):
                self.deleted_count = deleted_count
        return Result(deleted_count=0)

    async def count_documents(self, query: Dict[str, Any] = None):
        q = query or {}
        if not q:
            return len(self._data)
        # simple implementation only supports empty query
        return len(self._data)

    def aggregate(self, pipeline: List[Dict[str, Any]]):
        # very small aggregator for group by translation_type
        async def gen():
            counts = {}
            for d in self._data:
                key = d.get("translation_type")
                counts[key] = counts.get(key, 0) + 1
            for k, v in counts.items():
                yield {"_id": k, "count": v}
        return gen()


class InMemoryDB:
    def __init__(self):
        self._collections: Dict[str, InMemoryCollection] = {}

    def __getitem__(self, name: str) -> InMemoryCollection:
        if name not in self._collections:
            self._collections[name] = InMemoryCollection()
        return self._collections[name]


async def connect_db():
    """Connect to MongoDB database or fall back to in-memory DB for dev.

    The application no longer starts successfully without a MongoDB server
    unless `USE_IN_MEMORY_DB` is explicitly set to true.  Connection failures are
    now propagated so that problems surface at startup instead of silently
    degrading functionality.
    """
    global client, db
    if settings.use_in_memory_db:
        db = InMemoryDB()
        logger.info("Using in-memory database (development mode)")
        return

    # Attempt to connect to the configured MongoDB URL and raise on failure
    client = AsyncIOMotorClient(settings.mongodb_url, serverSelectionTimeoutMS=5000)
    try:
        await client.admin.command("ping")
    except Exception as e:
        # force crash if Mongo is not reachable
        logger.error(f"Could not connect to MongoDB at {settings.mongodb_url}: {e}")
        raise
    db = client[settings.database_name]
    logger.info("Connected to MongoDB successfully")


async def close_db():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        logger.info("Closed MongoDB connection")


def get_db() -> Any:
    """Get database instance"""
    if db is None:
        logger.error("Database not initialized. MongoDB may not be running.")
        raise RuntimeError("Database not available. Ensure MongoDB is running at " + settings.mongodb_url)
    return db

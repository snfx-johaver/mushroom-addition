"""Bounded request cache shared by cards and users."""

import asyncio
from collections import OrderedDict
from time import monotonic


class MarketCache:
    def __init__(self, fetch, ttl=300, limit=64):
        self.fetch = fetch
        self.ttl = ttl
        self.limit = limit
        self.cache = OrderedDict()
        self.pending = {}
        self.semaphore = asyncio.Semaphore(2)

    async def get(self, symbol, chart_range):
        key = (symbol, chart_range)
        cached = self.cache.get(key)
        if cached and monotonic() - cached[0] < self.ttl:
            self.cache.move_to_end(key)
            return self.result(cached)
        if key not in self.pending:
            # Bound queued work as well as cached results.
            if len(self.pending) >= self.limit:
                raise ValueError("Market data is busy; retry shortly")
            task = asyncio.create_task(self.load(key))
            self.pending[key] = task
        return self.result(await asyncio.shield(self.pending[key]))

    def result(self, cached):
        fetched_at, snapshot = cached
        age = snapshot.get("quote_age")
        return {**snapshot, "interval": self.ttl,
                "quote_age": age + monotonic() - fetched_at if age is not None else None}

    async def load(self, key):
        try:
            async with self.semaphore:
                snapshot = await self.fetch(*key)
            cached = (monotonic(), snapshot)
            self.cache[key] = cached
            self.cache.move_to_end(key)
            while len(self.cache) > self.limit:
                self.cache.popitem(last=False)
            return cached
        finally:
            self.pending.pop(key, None)

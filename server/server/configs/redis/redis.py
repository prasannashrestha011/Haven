import redis


def get_redis_client() -> redis.Redis:
    r = redis.Redis(host="localhost", port=6379, db=1)
    return r


def cache_file_content(r: redis.Redis, file_name: str, file_content: str):
    r.setex(file_name, 3600, file_content)
    print(f"{file_name}:File content cached for 1 hour")

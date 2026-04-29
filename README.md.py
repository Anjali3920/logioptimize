from concurrent.futures import ThreadPoolExecutor
from typing import List

_executor = ThreadPoolExecutor(max_workers=4)
THRESHOLD = 1000

def merge(left: List[int], right: List[int]) -> List[int]:
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]: result.append(left[i]); i+=1
        else: result.append(right[j]); j+=1
    result.extend(left[i:]); result.extend(right[j:])
    return result

def parallel_merge_sort(arr: List[int], depth: int=0) -> List[int]:
    """Parallel merge sort — falls back to sequential below threshold."""
    if len(arr) <= 1: return arr
    if len(arr) < THRESHOLD or depth > 3:
        mid = len(arr)//2
        return merge(
            parallel_merge_sort(arr[:mid], depth+1),
            parallel_merge_sort(arr[mid:], depth+1))
    mid = len(arr)//2
    fl = _executor.submit(parallel_merge_sort, arr[:mid], depth+1)
    fr = _executor.submit(parallel_merge_sort, arr[mid:], depth+1)
    return merge(fl.result(), fr.result())

if __name__ == "__main__":
    import random, time
    data = [random.randint(0,10000) for _ in range(100_000)]
    t0 = time.perf_counter()
    result = parallel_merge_sort(data)
    print(f"Sorted {len(data)} in {(time.perf_counter()-t0)*1000:.1f}ms")
    assert result == sorted(data)

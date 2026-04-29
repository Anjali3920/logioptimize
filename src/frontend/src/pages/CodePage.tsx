import { CodeBlock } from "@/components/CodeBlock";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github } from "lucide-react";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Lang = "python" | "cpp" | "java";

interface AlgoSnippet {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: Record<Lang, string>;
}

// ── Sorting Algorithms ─────────────────────────────────────────────────────────

const SORTING_ALGOS: AlgoSnippet[] = [
  {
    name: "Merge Sort — Sort by Deadline",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    code: {
      python: `from dataclasses import dataclass
from typing import List

@dataclass
class DeliveryRequest:
    id: str
    deadline: int       # Unix timestamp
    priority: str
    weight: float

def merge_sort(requests: List[DeliveryRequest]) -> List[DeliveryRequest]:
    """Sort delivery requests by deadline using merge sort."""
    if len(requests) <= 1:
        return requests
    mid = len(requests) // 2
    left = merge_sort(requests[:mid])
    right = merge_sort(requests[mid:])
    return merge(left, right)

def merge(left: List[DeliveryRequest],
          right: List[DeliveryRequest]) -> List[DeliveryRequest]:
    result: List[DeliveryRequest] = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i].deadline <= right[j].deadline:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

if __name__ == "__main__":
    deliveries = [
        DeliveryRequest("D1", 1700000300, "HIGH",   5.0),
        DeliveryRequest("D2", 1700000100, "VIP",    2.0),
        DeliveryRequest("D3", 1700000200, "MEDIUM", 8.0),
    ]
    for d in merge_sort(deliveries):
        print(f"{d.id}: deadline={d.deadline}")`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

struct DeliveryRequest {
    string id; long long deadline;
    string priority; double weight;
};

void merge(vector<DeliveryRequest>& arr, int l, int m, int r) {
    vector<DeliveryRequest> L(arr.begin()+l, arr.begin()+m+1);
    vector<DeliveryRequest> R(arr.begin()+m+1, arr.begin()+r+1);
    int i=0,j=0,k=l;
    while(i<(int)L.size()&&j<(int)R.size())
        arr[k++]=(L[i].deadline<=R[j].deadline)?L[i++]:R[j++];
    while(i<(int)L.size()) arr[k++]=L[i++];
    while(j<(int)R.size()) arr[k++]=R[j++];
}

void mergeSort(vector<DeliveryRequest>& arr, int l, int r) {
    if(l>=r) return;
    int m=l+(r-l)/2;
    mergeSort(arr,l,m); mergeSort(arr,m+1,r);
    merge(arr,l,m,r);
}

int main() {
    vector<DeliveryRequest> d={
        {"D1",1700000300LL,"HIGH",5},
        {"D2",1700000100LL,"VIP",2},
        {"D3",1700000200LL,"MEDIUM",8}
    };
    mergeSort(d,0,(int)d.size()-1);
    for(auto& x:d) cout<<x.id<<": "<<x.deadline<<"\\n";
}`,
      java: `import java.util.*;

public class MergeSort {
    static class DeliveryRequest {
        String id; long deadline; String priority; double weight;
        DeliveryRequest(String id,long dl,String pr,double w){
            this.id=id; this.deadline=dl;
            this.priority=pr; this.weight=w;
        }
    }

    public static void mergeSort(List<DeliveryRequest> arr) {
        if(arr.size()<=1) return;
        int mid=arr.size()/2;
        List<DeliveryRequest> left=new ArrayList<>(arr.subList(0,mid));
        List<DeliveryRequest> right=new ArrayList<>(arr.subList(mid,arr.size()));
        mergeSort(left); mergeSort(right);
        int i=0,j=0,k=0;
        while(i<left.size()&&j<right.size())
            arr.set(k++, left.get(i).deadline<=right.get(j).deadline
                ? left.get(i++) : right.get(j++));
        while(i<left.size()) arr.set(k++,left.get(i++));
        while(j<right.size()) arr.set(k++,right.get(j++));
    }

    public static void main(String[] args) {
        List<DeliveryRequest> d=new ArrayList<>(Arrays.asList(
            new DeliveryRequest("D1",1700000300L,"HIGH",5),
            new DeliveryRequest("D2",1700000100L,"VIP",2),
            new DeliveryRequest("D3",1700000200L,"MEDIUM",8)
        ));
        mergeSort(d);
        for(DeliveryRequest r:d)
            System.out.println(r.id+": "+r.deadline);
    }
}`,
    },
  },
  {
    name: "Quick Sort — Sort by Priority",
    timeComplexity: "O(n log n) avg",
    spaceComplexity: "O(log n)",
    code: {
      python: `from dataclasses import dataclass
from typing import List

PRIORITY_MAP = {"VIP":4,"HIGH":3,"MEDIUM":2,"LOW":1}

@dataclass
class DeliveryRequest:
    id: str; priority: str; weight: float

def quick_sort(arr: List[DeliveryRequest], lo: int, hi: int) -> None:
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p-1)
        quick_sort(arr, p+1, hi)

def partition(arr: List[DeliveryRequest], lo: int, hi: int) -> int:
    pivot = PRIORITY_MAP[arr[hi].priority]
    i = lo - 1
    for j in range(lo, hi):
        if PRIORITY_MAP[arr[j].priority] >= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1

if __name__ == "__main__":
    d = [
        DeliveryRequest("D1","LOW",5),
        DeliveryRequest("D2","VIP",2),
        DeliveryRequest("D3","MEDIUM",8),
        DeliveryRequest("D4","HIGH",3),
    ]
    quick_sort(d, 0, len(d)-1)
    for x in d: print(f"{x.id}: {x.priority}")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

unordered_map<string,int> PRIORITY={
    {"VIP",4},{"HIGH",3},{"MEDIUM",2},{"LOW",1}};
struct Delivery { string id, priority; double weight; };

int partition(vector<Delivery>& a, int lo, int hi) {
    int pivot=PRIORITY[a[hi].priority];
    int i=lo-1;
    for(int j=lo;j<hi;j++)
        if(PRIORITY[a[j].priority]>=pivot) swap(a[++i],a[j]);
    swap(a[i+1],a[hi]); return i+1;
}
void quickSort(vector<Delivery>& a, int lo, int hi) {
    if(lo<hi){int p=partition(a,lo,hi);quickSort(a,lo,p-1);quickSort(a,p+1,hi);}
}

int main() {
    vector<Delivery> d={{"D1","LOW",5},{"D2","VIP",2},
        {"D3","MEDIUM",8},{"D4","HIGH",3}};
    quickSort(d,0,(int)d.size()-1);
    for(auto& x:d) cout<<x.id<<": "<<x.priority<<"\\n";
}`,
      java: `import java.util.*;

public class QuickSort {
    static Map<String,Integer> PRIORITY=Map.of(
        "VIP",4,"HIGH",3,"MEDIUM",2,"LOW",1);
    record Delivery(String id, String priority, double weight) {}

    static int partition(List<Delivery> a, int lo, int hi) {
        int pivot=PRIORITY.get(a.get(hi).priority());
        int i=lo-1;
        for(int j=lo;j<hi;j++)
            if(PRIORITY.get(a.get(j).priority())>=pivot)
                Collections.swap(a,++i,j);
        Collections.swap(a,i+1,hi); return i+1;
    }
    static void quickSort(List<Delivery> a, int lo, int hi) {
        if(lo<hi){int p=partition(a,lo,hi);quickSort(a,lo,p-1);quickSort(a,p+1,hi);}
    }
    public static void main(String[] args) {
        List<Delivery> d=new ArrayList<>(Arrays.asList(
            new Delivery("D1","LOW",5), new Delivery("D2","VIP",2),
            new Delivery("D3","MEDIUM",8), new Delivery("D4","HIGH",3)));
        quickSort(d,0,d.size()-1);
        for(Delivery x:d) System.out.println(x.id()+": "+x.priority());
    }
}`,
    },
  },
  {
    name: "Heap Sort — Dynamic Priority Queue",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    code: {
      python: `import heapq
from dataclasses import dataclass, field
from typing import List

SCORE = {"VIP":4,"HIGH":3,"MEDIUM":2,"LOW":1}

@dataclass(order=True)
class PQItem:
    neg_priority: int
    deadline: int
    request_id: str = field(compare=False)
    weight: float = field(compare=False)

class VIPPriorityQueue:
    """Max-heap priority queue — VIP orders served first."""
    def __init__(self): self._heap: List[PQItem] = []

    def push(self, req_id, priority, deadline, weight):
        heapq.heappush(self._heap,
            PQItem(-SCORE.get(priority,0), deadline, req_id, weight))

    def pop(self) -> PQItem:
        return heapq.heappop(self._heap)

    def is_empty(self) -> bool: return len(self._heap)==0

if __name__ == "__main__":
    pq = VIPPriorityQueue()
    pq.push("D1","LOW",   1700000400,5)
    pq.push("D2","VIP",   1700000100,2)
    pq.push("D3","MEDIUM",1700000300,8)
    pq.push("D4","HIGH",  1700000200,3)
    while not pq.is_empty():
        item = pq.pop()
        print(f"{item.request_id} (deadline={item.deadline})")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

struct Delivery {
    string id, priority; int deadline; double weight;
    bool operator<(const Delivery& o) const {
        auto sc=[](const string& p){
            if(p=="VIP") return 4; if(p=="HIGH") return 3;
            if(p=="MEDIUM") return 2; return 1;};
        int s1=sc(priority),s2=sc(o.priority);
        if(s1!=s2) return s1<s2;
        return deadline>o.deadline;
    }
};

int main() {
    priority_queue<Delivery> pq;
    pq.push({"D1","LOW",   1700000400,5});
    pq.push({"D2","VIP",   1700000100,2});
    pq.push({"D3","MEDIUM",1700000300,8});
    pq.push({"D4","HIGH",  1700000200,3});
    while(!pq.empty()){
        auto t=pq.top(); pq.pop();
        cout<<t.id<<" ["<<t.priority<<"]\\n";
    }
}`,
      java: `import java.util.*;

public class HeapSort {
    static int score(String p){
        return switch(p){"VIP"->4;"HIGH"->3;"MEDIUM"->2;default->1;};
    }
    record Delivery(String id, String priority, int deadline, double weight){}

    public static void main(String[] args) {
        PriorityQueue<Delivery> pq=new PriorityQueue<>((a,b)->{
            int sa=score(a.priority()),sb=score(b.priority());
            if(sa!=sb) return sb-sa;
            return a.deadline()-b.deadline();
        });
        pq.add(new Delivery("D1","LOW",   1700000400,5));
        pq.add(new Delivery("D2","VIP",   1700000100,2));
        pq.add(new Delivery("D3","MEDIUM",1700000300,8));
        pq.add(new Delivery("D4","HIGH",  1700000200,3));
        while(!pq.isEmpty()){
            Delivery d=pq.poll();
            System.out.println(d.id()+" ["+d.priority()+"]");
        }
    }
}`,
    },
  },
];

// ── Graph Algorithms ───────────────────────────────────────────────────────────

const GRAPH_ALGOS: AlgoSnippet[] = [
  {
    name: "Dijkstra — Shortest Delivery Path",
    timeComplexity: "O((V+E) log V)",
    spaceComplexity: "O(V)",
    code: {
      python: `import heapq
from collections import defaultdict
from typing import Dict, List, Tuple

Graph = Dict[str, List[Tuple[str, float]]]

def dijkstra(graph: Graph, src: str) -> Tuple[Dict[str,float], Dict[str,str]]:
    """Shortest paths from src using adjacency list + min-heap."""
    dist: Dict[str,float] = defaultdict(lambda: float('inf'))
    prev: Dict[str,str] = {}
    dist[src] = 0.0
    heap = [(0.0, src)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]: continue
        for v, w in graph.get(u, []):
            nd = dist[u] + w
            if nd < dist[v]:
                dist[v] = nd; prev[v] = u
                heapq.heappush(heap, (nd, v))
    return dict(dist), prev

def reconstruct(prev: Dict[str,str], target: str) -> List[str]:
    path, node = [], target
    while node in prev: path.append(node); node = prev[node]
    path.append(node); return list(reversed(path))

if __name__ == "__main__":
    g: Graph = {
        "Warehouse":[("CityA",4),("CityB",2)],
        "CityA":    [("CityC",5),("CityB",1)],
        "CityB":    [("CityC",8),("CityD",2)],
        "CityC":    [("Depot", 2)],
        "CityD":    [("Depot", 4)],
    }
    dist, prev = dijkstra(g, "Warehouse")
    path = reconstruct(prev, "Depot")
    print(f"Path: {' -> '.join(path)}, cost: {dist['Depot']}")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
typedef pair<double,string> pds;
typedef unordered_map<string,vector<pair<string,double>>> Graph;

pair<unordered_map<string,double>,unordered_map<string,string>>
dijkstra(const Graph& g, const string& src) {
    unordered_map<string,double> dist;
    unordered_map<string,string> prev;
    for(auto&[u,_]:g) dist[u]=1e18;
    dist[src]=0;
    priority_queue<pds,vector<pds>,greater<>> pq;
    pq.push({0,src});
    while(!pq.empty()){
        auto[d,u]=pq.top(); pq.pop();
        if(d>dist[u]) continue;
        if(g.count(u)) for(auto&[v,w]:g.at(u)){
            double nd=dist[u]+w;
            if(nd<dist[v]){dist[v]=nd;prev[v]=u;pq.push({nd,v});}
        }
    }
    return{dist,prev};
}
int main(){
    Graph g={
        {"Warehouse",{{"CityA",4},{"CityB",2}}},
        {"CityA",    {{"CityC",5},{"CityB",1}}},
        {"CityB",    {{"CityC",8},{"CityD",2}}},
        {"CityC",    {{"Depot",2}}},
        {"CityD",    {{"Depot",4}}},
    };
    auto[dist,prev]=dijkstra(g,"Warehouse");
    cout<<"Cost to Depot: "<<dist["Depot"]<<"\\n";
}`,
      java: `import java.util.*;

public class Dijkstra {
    record Edge(String to, double w){}

    static Map<String,Double> dijkstra(Map<String,List<Edge>> g, String src){
        Map<String,Double> dist=new HashMap<>();
        g.keySet().forEach(n->dist.put(n,Double.MAX_VALUE));
        dist.put(src,0.0);
        PriorityQueue<double[]> pq=new PriorityQueue<>(
            Comparator.comparingDouble(a->a[0]));
        List<String> nodes=new ArrayList<>(g.keySet());
        Map<String,Integer> idx=new HashMap<>();
        for(int i=0;i<nodes.size();i++) idx.put(nodes.get(i),i);
        pq.offer(new double[]{0,idx.get(src)});
        while(!pq.isEmpty()){
            double[] top=pq.poll();
            String u=nodes.get((int)top[1]);
            if(top[0]>dist.get(u)) continue;
            for(Edge e:g.getOrDefault(u,List.of())){
                double nd=dist.get(u)+e.w();
                if(nd<dist.getOrDefault(e.to(),Double.MAX_VALUE)){
                    dist.put(e.to(),nd);
                    pq.offer(new double[]{nd,idx.getOrDefault(e.to(),0)});
                }
            }
        }
        return dist;
    }
    public static void main(String[] args){
        Map<String,List<Edge>> g=new HashMap<>();
        g.put("Warehouse",List.of(new Edge("CityA",4),new Edge("CityB",2)));
        g.put("CityA",List.of(new Edge("CityC",5),new Edge("CityB",1)));
        g.put("CityB",List.of(new Edge("CityC",8),new Edge("CityD",2)));
        g.put("CityC",List.of(new Edge("Depot",2)));
        g.put("CityD",List.of(new Edge("Depot",4)));
        System.out.println("Cost: "+dijkstra(g,"Warehouse").get("Depot"));
    }
}`,
    },
  },
  {
    name: "Bellman-Ford — Negative Edge Detection",
    timeComplexity: "O(V × E)",
    spaceComplexity: "O(V)",
    code: {
      python: `from typing import Dict, List, Tuple, Optional

Edge = Tuple[str, str, float]

def bellman_ford(
    nodes: List[str], edges: List[Edge], src: str
) -> Optional[Dict[str, float]]:
    """Bellman-Ford with negative cycle detection."""
    dist: Dict[str,float] = {n: float('inf') for n in nodes}
    dist[src] = 0.0
    for _ in range(len(nodes)-1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            print("WARNING: Negative cycle detected!")
            return None
    return dist

if __name__ == "__main__":
    nodes = ["W","A","B","C","D"]
    edges: List[Edge] = [
        ("W","A",4),("W","B",2),("A","C",5),
        ("B","A",-1),("B","C",8),("B","D",2),("C","D",1)
    ]
    result = bellman_ford(nodes, edges, "W")
    if result:
        for node, cost in result.items():
            print(f"  W -> {node}: {cost}")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
struct Edge { string u,v; double w; };

optional<unordered_map<string,double>>
bellmanFord(const vector<string>& nodes,
            const vector<Edge>& edges,
            const string& src) {
    unordered_map<string,double> dist;
    for(auto& n:nodes) dist[n]=1e18;
    dist[src]=0;
    int V=nodes.size();
    for(int i=0;i<V-1;i++)
        for(auto& e:edges)
            if(dist[e.u]+e.w<dist[e.v]) dist[e.v]=dist[e.u]+e.w;
    for(auto& e:edges)
        if(dist[e.u]+e.w<dist[e.v]){
            cerr<<"Negative cycle!\\n"; return nullopt;
        }
    return dist;
}
int main(){
    vector<string> nodes={"W","A","B","C","D"};
    vector<Edge> edges={
        {"W","A",4},{"W","B",2},{"A","C",5},
        {"B","A",-1},{"B","C",8},{"B","D",2},{"C","D",1}
    };
    auto res=bellmanFord(nodes,edges,"W");
    if(res) for(auto&[n,d]:*res) cout<<"W->"<<n<<": "<<d<<"\\n";
}`,
      java: `import java.util.*;

public class BellmanFord {
    record Edge(String u, String v, double w){}

    static Map<String,Double> bellmanFord(
            List<String> nodes, List<Edge> edges, String src){
        Map<String,Double> dist=new HashMap<>();
        for(String n:nodes) dist.put(n,Double.MAX_VALUE/2);
        dist.put(src,0.0);
        for(int i=0;i<nodes.size()-1;i++)
            for(Edge e:edges){
                double nd=dist.get(e.u())+e.w();
                if(nd<dist.get(e.v())) dist.put(e.v(),nd);
            }
        for(Edge e:edges)
            if(dist.get(e.u())+e.w()<dist.get(e.v())){
                System.err.println("Negative cycle!");
                return Collections.emptyMap();
            }
        return dist;
    }
    public static void main(String[] args){
        List<Edge> edges=List.of(
            new Edge("W","A",4),new Edge("W","B",2),new Edge("A","C",5),
            new Edge("B","A",-1),new Edge("B","C",8),
            new Edge("B","D",2),new Edge("C","D",1)
        );
        var dist=bellmanFord(List.of("W","A","B","C","D"),edges,"W");
        dist.forEach((n,d)->System.out.println("W->"+n+": "+d));
    }
}`,
    },
  },
  {
    name: "Prim's MST — Minimum Spanning Network",
    timeComplexity: "O(E log V)",
    spaceComplexity: "O(V + E)",
    code: {
      python: `import heapq
from collections import defaultdict
from typing import Dict, List, Tuple

Graph = Dict[str, List[Tuple[str, float]]]

def prim_mst(graph: Graph) -> Tuple[List[Tuple[str,str,float]], float]:
    """Prim's algorithm for minimum spanning tree."""
    if not graph: return [], 0.0
    start = next(iter(graph))
    visited = {start}
    heap: List[Tuple[float,str,str]] = []
    mst: List[Tuple[str,str,float]] = []
    total = 0.0
    for nbr, w in graph[start]:
        heapq.heappush(heap, (w, start, nbr))
    while heap and len(visited) < len(graph):
        w, u, v = heapq.heappop(heap)
        if v in visited: continue
        visited.add(v); mst.append((u,v,w)); total += w
        for nbr, nw in graph.get(v,[]):
            if nbr not in visited:
                heapq.heappush(heap, (nw, v, nbr))
    return mst, total

if __name__ == "__main__":
    g: Graph = {
        "Warehouse":[("HubA",4),("HubB",2)],
        "HubA":     [("Warehouse",4),("HubB",1),("CityC",5)],
        "HubB":     [("Warehouse",2),("HubA",1),("CityD",3)],
        "CityC":    [("HubA",5),("Depot",4)],
        "CityD":    [("HubB",3),("Depot",6)],
        "Depot":    [("CityC",4),("CityD",6)],
    }
    edges, cost = prim_mst(g)
    print(f"MST cost: {cost}")
    for u,v,w in edges: print(f"  {u} -- {v}  [{w}]")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
typedef tuple<double,string,string> T3;

vector<tuple<string,string,double>>
primMST(map<string,vector<pair<string,double>>>& g){
    vector<tuple<string,string,double>> mst;
    if(g.empty()) return mst;
    set<string> vis;
    priority_queue<T3,vector<T3>,greater<T3>> pq;
    string start=g.begin()->first;
    vis.insert(start);
    for(auto&[v,w]:g[start]) pq.push({w,start,v});
    double total=0;
    while(!pq.empty()&&vis.size()<g.size()){
        auto[w,u,v]=pq.top(); pq.pop();
        if(vis.count(v)) continue;
        vis.insert(v); mst.push_back({u,v,w}); total+=w;
        for(auto&[nb,nw]:g[v])
            if(!vis.count(nb)) pq.push({nw,v,nb});
    }
    cout<<"MST cost: "<<total<<"\\n";
    return mst;
}
int main(){
    map<string,vector<pair<string,double>>> g={
        {"Warehouse",{{"HubA",4},{"HubB",2}}},
        {"HubA",{{"Warehouse",4},{"HubB",1},{"CityC",5}}},
        {"HubB",{{"Warehouse",2},{"HubA",1},{"CityD",3}}},
        {"CityC",{{"HubA",5},{"Depot",4}}},
        {"CityD",{{"HubB",3},{"Depot",6}}},
        {"Depot",{{"CityC",4},{"CityD",6}}},
    };
    for(auto&[u,v,w]:primMST(g)) cout<<u<<" -- "<<v<<" ["<<w<<"]\\n";
}`,
      java: `import java.util.*;

public class PrimMST {
    record Edge(String to, double w){}
    public static void main(String[] args){
        Map<String,List<Edge>> g=new HashMap<>();
        g.put("Warehouse",List.of(new Edge("HubA",4),new Edge("HubB",2)));
        g.put("HubA",List.of(new Edge("Warehouse",4),new Edge("HubB",1),new Edge("CityC",5)));
        g.put("HubB",List.of(new Edge("Warehouse",2),new Edge("HubA",1),new Edge("CityD",3)));
        g.put("CityC",List.of(new Edge("HubA",5),new Edge("Depot",4)));
        g.put("CityD",List.of(new Edge("HubB",3),new Edge("Depot",6)));
        g.put("Depot",List.of(new Edge("CityC",4),new Edge("CityD",6)));

        Set<String> vis=new HashSet<>();
        PriorityQueue<double[]> pq=new PriorityQueue<>(
            Comparator.comparingDouble(a->a[0]));
        List<String> nodes=new ArrayList<>(g.keySet());
        Map<String,Integer> idx=new HashMap<>();
        for(int i=0;i<nodes.size();i++) idx.put(nodes.get(i),i);
        String start=nodes.get(0);
        vis.add(start);
        for(Edge e:g.get(start))
            pq.offer(new double[]{e.w(),idx.getOrDefault(start,0),idx.getOrDefault(e.to(),0)});
        double total=0;
        while(!pq.isEmpty()&&vis.size()<g.size()){
            double[] top=pq.poll();
            String v=nodes.get((int)top[2]);
            if(vis.contains(v)) continue;
            vis.add(v); total+=top[0];
            for(Edge e:g.getOrDefault(v,List.of()))
                if(!vis.contains(e.to()))
                    pq.offer(new double[]{e.w(),(double)idx.getOrDefault(v,0),idx.getOrDefault(e.to(),0)});
        }
        System.out.println("MST total cost: "+total);
    }
}`,
    },
  },
];

// ── Greedy Algorithms ──────────────────────────────────────────────────────────

const GREEDY_ALGOS: AlgoSnippet[] = [
  {
    name: "Activity Selection — Vehicle Scheduling",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    code: {
      python: `from dataclasses import dataclass
from typing import List

@dataclass
class Job:
    id: str; start: int; finish: int

def activity_selection(jobs: List[Job]) -> List[Job]:
    """Select max non-overlapping delivery jobs (greedy)."""
    sorted_jobs = sorted(jobs, key=lambda j: j.finish)
    selected = [sorted_jobs[0]]
    last = sorted_jobs[0].finish
    for job in sorted_jobs[1:]:
        if job.start >= last:
            selected.append(job); last = job.finish
    return selected

if __name__ == "__main__":
    jobs = [
        Job("J1",480,600), Job("J2",540,720), Job("J3",600,780),
        Job("J4",720,840), Job("J5",780,900), Job("J6",840,960),
    ]
    result = activity_selection(jobs)
    print(f"Max jobs: {len(result)}")
    for j in result:
        print(f"  {j.id}: {j.start//60}:00-{j.finish//60}:00")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
struct Job { string id; int start, finish; };

vector<Job> activitySelection(vector<Job> jobs){
    sort(jobs.begin(),jobs.end(),
        [](const Job& a,const Job& b){return a.finish<b.finish;});
    vector<Job> sel={jobs[0]};
    int last=jobs[0].finish;
    for(size_t i=1;i<jobs.size();i++)
        if(jobs[i].start>=last){sel.push_back(jobs[i]);last=jobs[i].finish;}
    return sel;
}
int main(){
    vector<Job> jobs={
        {"J1",480,600},{"J2",540,720},{"J3",600,780},
        {"J4",720,840},{"J5",780,900},{"J6",840,960}
    };
    auto sel=activitySelection(jobs);
    cout<<"Max jobs: "<<sel.size()<<"\\n";
    for(auto& j:sel) cout<<"  "<<j.id<<": "<<j.start/60<<"h-"<<j.finish/60<<"h\\n";
}`,
      java: `import java.util.*;

public class ActivitySelection {
    record Job(String id, int start, int finish){}

    static List<Job> select(List<Job> jobs){
        List<Job> sorted=new ArrayList<>(jobs);
        sorted.sort(Comparator.comparingInt(Job::finish));
        List<Job> sel=new ArrayList<>();
        sel.add(sorted.get(0));
        int last=sorted.get(0).finish();
        for(int i=1;i<sorted.size();i++)
            if(sorted.get(i).start()>=last){
                sel.add(sorted.get(i)); last=sorted.get(i).finish();
            }
        return sel;
    }
    public static void main(String[] args){
        List<Job> jobs=List.of(
            new Job("J1",480,600),new Job("J2",540,720),
            new Job("J3",600,780),new Job("J4",720,840),
            new Job("J5",780,900),new Job("J6",840,960)
        );
        List<Job> res=select(jobs);
        System.out.println("Max jobs: "+res.size());
        res.forEach(j->System.out.println("  "+j.id()));
    }
}`,
    },
  },
  {
    name: "Fractional Knapsack — Load Optimization",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    code: {
      python: `from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class Package:
    id: str; weight: float; value: float

def fractional_knapsack(
    packages: List[Package], capacity: float
) -> Tuple[float, List[Tuple[Package,float]]]:
    """Greedy fractional knapsack — maximize revenue per load."""
    sorted_pkgs = sorted(packages,
        key=lambda p: p.value/p.weight, reverse=True)
    total, rem = 0.0, capacity
    selected: List[Tuple[Package,float]] = []
    for pkg in sorted_pkgs:
        if rem <= 0: break
        frac = min(1.0, rem/pkg.weight)
        selected.append((pkg, frac))
        total += frac * pkg.value
        rem -= frac * pkg.weight
    return total, selected

if __name__ == "__main__":
    packages = [
        Package("P1",10,60), Package("P2",20,100), Package("P3",30,120)
    ]
    value, loaded = fractional_knapsack(packages, capacity=50)
    print(f"Max revenue: {value:.2f}")
    for pkg, frac in loaded:
        print(f"  {pkg.id}: {frac*100:.0f}% ({frac*pkg.weight:.1f}kg)")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
struct Package { string id; double weight, value; };

double fractionalKnapsack(vector<Package> pkgs, double cap){
    sort(pkgs.begin(),pkgs.end(),[](const Package& a,const Package& b){
        return a.value/a.weight>b.value/b.weight;});
    double total=0;
    for(auto& p:pkgs){
        if(cap<=0) break;
        double frac=min(1.0,cap/p.weight);
        total+=frac*p.value; cap-=frac*p.weight;
        printf("  %s: %.0f%% loaded\\n",p.id.c_str(),frac*100);
    }
    return total;
}
int main(){
    vector<Package> pkgs={{"P1",10,60},{"P2",20,100},{"P3",30,120}};
    printf("Max revenue: %.2f\\n",fractionalKnapsack(pkgs,50));
}`,
      java: `import java.util.*;

public class FractionalKnapsack {
    record Package(String id, double weight, double value){}

    static double solve(List<Package> pkgs, double cap){
        List<Package> sorted=new ArrayList<>(pkgs);
        sorted.sort((a,b)->Double.compare(
            b.value()/b.weight(), a.value()/a.weight()));
        double total=0, rem=cap;
        for(Package p:sorted){
            if(rem<=0) break;
            double frac=Math.min(1.0,rem/p.weight());
            total+=frac*p.value(); rem-=frac*p.weight();
            System.out.printf("  %s: %.0f%% loaded%n",p.id(),frac*100);
        }
        return total;
    }
    public static void main(String[] args){
        List<Package> pkgs=List.of(
            new Package("P1",10,60),
            new Package("P2",20,100),
            new Package("P3",30,120));
        System.out.printf("Max revenue: %.2f%n",solve(pkgs,50));
    }
}`,
    },
  },
  {
    name: "Job Scheduling — Deadline Maximization",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n)",
    code: {
      python: `from dataclasses import dataclass
from typing import List, Optional

@dataclass
class DeliveryJob:
    id: str; deadline: int; profit: float

def job_scheduling(jobs: List[DeliveryJob]) -> List[DeliveryJob]:
    """Greedy job scheduling — maximize profit before deadlines."""
    sorted_jobs = sorted(jobs, key=lambda j: j.profit, reverse=True)
    max_deadline = max(j.deadline for j in jobs)
    slots: List[Optional[DeliveryJob]] = [None]*(max_deadline+1)
    for job in sorted_jobs:
        for t in range(job.deadline, 0, -1):
            if slots[t] is None:
                slots[t] = job; break
    return [j for j in slots if j is not None]

if __name__ == "__main__":
    jobs = [
        DeliveryJob("D1",2,100), DeliveryJob("D2",1,19),
        DeliveryJob("D3",2,27),  DeliveryJob("D4",1,25),
        DeliveryJob("D5",3,15),
    ]
    scheduled = job_scheduling(jobs)
    total = sum(j.profit for j in scheduled)
    print(f"Scheduled: {[j.id for j in scheduled]}")
    print(f"Total profit: {total}")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
struct Job { string id; int deadline; double profit; };

vector<Job> jobScheduling(vector<Job> jobs){
    sort(jobs.begin(),jobs.end(),
        [](const Job& a,const Job& b){return a.profit>b.profit;});
    int maxD=max_element(jobs.begin(),jobs.end(),
        [](const Job& a,const Job& b){return a.deadline<b.deadline;}
    )->deadline;
    vector<Job*> slots(maxD+1,nullptr);
    for(auto& job:jobs)
        for(int t=job.deadline;t>=1;t--)
            if(!slots[t]){slots[t]=&job;break;}
    vector<Job> result;
    for(auto* s:slots) if(s) result.push_back(*s);
    return result;
}
int main(){
    vector<Job> jobs={
        {"D1",2,100},{"D2",1,19},{"D3",2,27},
        {"D4",1,25},{"D5",3,15}};
    auto res=jobScheduling(jobs);
    double total=0;
    for(auto& j:res){cout<<j.id<<" ";total+=j.profit;}
    cout<<"\\nProfit: "<<total<<"\\n";
}`,
      java: `import java.util.*;

public class JobScheduling {
    record Job(String id, int deadline, double profit){}

    static List<Job> schedule(List<Job> jobs){
        List<Job> sorted=new ArrayList<>(jobs);
        sorted.sort((a,b)->Double.compare(b.profit(),a.profit()));
        int maxD=sorted.stream().mapToInt(Job::deadline).max().orElse(0);
        Job[] slots=new Job[maxD+1];
        for(Job j:sorted)
            for(int t=j.deadline();t>=1;t--)
                if(slots[t]==null){slots[t]=j;break;}
        List<Job> result=new ArrayList<>();
        for(Job s:slots) if(s!=null) result.add(s);
        return result;
    }
    public static void main(String[] args){
        List<Job> jobs=List.of(
            new Job("D1",2,100),new Job("D2",1,19),
            new Job("D3",2,27),new Job("D4",1,25),
            new Job("D5",3,15));
        double total=schedule(jobs).stream().mapToDouble(Job::profit).sum();
        System.out.println("Profit: "+total);
    }
}`,
    },
  },
];

// ── Dynamic Programming ────────────────────────────────────────────────────────

const DP_ALGOS: AlgoSnippet[] = [
  {
    name: "0/1 Knapsack — Optimal Vehicle Loading",
    timeComplexity: "O(n × W)",
    spaceComplexity: "O(n × W)",
    code: {
      python: `from typing import List, Tuple

def knapsack_01(
    weights: List[int], values: List[int], capacity: int
) -> Tuple[int, List[int]]:
    """0/1 Knapsack with DP table — optimal discrete package selection."""
    n = len(weights)
    dp = [[0]*(capacity+1) for _ in range(n+1)]
    for i in range(1,n+1):
        for w in range(capacity+1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                    dp[i-1][w-weights[i-1]] + values[i-1])
    # Backtrack
    selected, w = [], capacity
    for i in range(n,0,-1):
        if dp[i][w] != dp[i-1][w]:
            selected.append(i-1); w -= weights[i-1]
    return dp[n][capacity], list(reversed(selected))

if __name__ == "__main__":
    packages=[("P1",2,6),("P2",2,10),("P3",3,12),("P4",5,20)]
    names=[p[0] for p in packages]
    weights=[p[1] for p in packages]
    values=[p[2] for p in packages]
    max_val, chosen = knapsack_01(weights, values, capacity=5)
    print(f"Max value: {max_val}")
    print(f"Selected: {[names[i] for i in chosen]}")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

pair<int,vector<int>>
knapsack01(vector<int>& w,vector<int>& v,int cap){
    int n=w.size();
    vector<vector<int>> dp(n+1,vector<int>(cap+1,0));
    for(int i=1;i<=n;i++)
        for(int c=0;c<=cap;c++){
            dp[i][c]=dp[i-1][c];
            if(w[i-1]<=c)
                dp[i][c]=max(dp[i][c],dp[i-1][c-w[i-1]]+v[i-1]);
        }
    vector<int> sel; int c=cap;
    for(int i=n;i>0;i--)
        if(dp[i][c]!=dp[i-1][c]){sel.push_back(i-1);c-=w[i-1];}
    reverse(sel.begin(),sel.end());
    return{dp[n][cap],sel};
}
int main(){
    vector<int> weights={2,2,3,5}, values={6,10,12,20};
    auto[val,sel]=knapsack01(weights,values,5);
    cout<<"Max value: "<<val<<"\\nItems: ";
    for(int i:sel) cout<<"P"<<i+1<<" ";
    cout<<"\\n";
}`,
      java: `import java.util.*;

public class Knapsack01 {
    static int[] solve(int[] w, int[] v, int cap){
        int n=w.length;
        int[][] dp=new int[n+1][cap+1];
        for(int i=1;i<=n;i++)
            for(int c=0;c<=cap;c++){
                dp[i][c]=dp[i-1][c];
                if(w[i-1]<=c)
                    dp[i][c]=Math.max(dp[i][c],dp[i-1][c-w[i-1]]+v[i-1]);
            }
        List<Integer> sel=new ArrayList<>();
        int c=cap;
        for(int i=n;i>0;i--)
            if(dp[i][c]!=dp[i-1][c]){sel.add(i-1);c-=w[i-1];}
        Collections.reverse(sel);
        System.out.println("Max value: "+dp[n][cap]);
        return sel.stream().mapToInt(Integer::intValue).toArray();
    }
    public static void main(String[] args){
        int[] w={2,2,3,5},v={6,10,12,20};
        int[] items=solve(w,v,5);
        System.out.print("Items: ");
        for(int i:items) System.out.print("P"+(i+1)+" ");
    }
}`,
    },
  },
  {
    name: "Floyd-Warshall — All-Pairs Shortest Paths",
    timeComplexity: "O(V³)",
    spaceComplexity: "O(V²)",
    code: {
      python: `from typing import List

INF = float('inf')

def floyd_warshall(n: int, edges: List[tuple]) -> List[List[float]]:
    """All-pairs shortest paths — complete route cost matrix."""
    dist = [[INF]*n for _ in range(n)]
    for i in range(n): dist[i][i] = 0
    for u,v,w in edges: dist[u][v] = min(dist[u][v], w)
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k]+dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k]+dist[k][j]
    return dist

if __name__ == "__main__":
    labels = ["WH","A","B","C","Depot"]
    edges = [(0,1,4),(0,2,2),(1,2,1),(1,3,5),
             (2,3,8),(2,4,10),(3,4,2),(4,0,3)]
    dist = floyd_warshall(5, edges)
    print("All-Pairs Cost Matrix:")
    for i,row in enumerate(dist):
        vals=" ".join(
            "INF" if v==INF else f"{v:.0f}" for v in row)
        print(f"  {labels[i]:5}: {vals}")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
const double INF=1e18;

vector<vector<double>>
floydWarshall(int n,vector<tuple<int,int,double>>& edges){
    vector<vector<double>> d(n,vector<double>(n,INF));
    for(int i=0;i<n;i++) d[i][i]=0;
    for(auto&[u,v,w]:edges) d[u][v]=min(d[u][v],w);
    for(int k=0;k<n;k++)
        for(int i=0;i<n;i++)
            for(int j=0;j<n;j++)
                if(d[i][k]+d[k][j]<d[i][j])
                    d[i][j]=d[i][k]+d[k][j];
    return d;
}
int main(){
    vector<tuple<int,int,double>> edges={
        {0,1,4},{0,2,2},{1,2,1},{1,3,5},
        {2,3,8},{2,4,10},{3,4,2},{4,0,3}
    };
    auto d=floydWarshall(5,edges);
    vector<string> lbl={"WH","A","B","C","Depot"};
    for(int i=0;i<5;i++){
        cout<<lbl[i]<<": ";
        for(int j=0;j<5;j++)
            cout<<(d[i][j]>=INF/2?"INF":to_string((int)d[i][j]))<<" ";
        cout<<"\\n";
    }
}`,
      java: `import java.util.*;

public class FloydWarshall {
    static double[][] solve(int n, int[][] edges){
        double[][] d=new double[n][n];
        for(double[] row:d) Arrays.fill(row,Double.MAX_VALUE/2);
        for(int i=0;i<n;i++) d[i][i]=0;
        for(int[] e:edges) d[e[0]][e[1]]=Math.min(d[e[0]][e[1]],e[2]);
        for(int k=0;k<n;k++)
            for(int i=0;i<n;i++)
                for(int j=0;j<n;j++)
                    if(d[i][k]+d[k][j]<d[i][j])
                        d[i][j]=d[i][k]+d[k][j];
        return d;
    }
    public static void main(String[] args){
        String[] lbl={"WH","A","B","C","Depot"};
        int[][] edges={{0,1,4},{0,2,2},{1,2,1},{1,3,5},
                       {2,3,8},{2,4,10},{3,4,2},{4,0,3}};
        double[][] d=solve(5,edges);
        for(int i=0;i<5;i++){
            System.out.print(lbl[i]+": ");
            for(int j=0;j<5;j++)
                System.out.printf("%-6.0f",d[i][j]>1e13?-1:d[i][j]);
            System.out.println();
        }
    }
}`,
    },
  },
];

// ── Divide & Conquer ───────────────────────────────────────────────────────────

const DC_ALGOS: AlgoSnippet[] = [
  {
    name: "Parallel Merge Sort — Scalable Sorting",
    timeComplexity: "O(n log n / p)",
    spaceComplexity: "O(n)",
    code: {
      python: `from concurrent.futures import ThreadPoolExecutor
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
    assert result == sorted(data)`,
      cpp: `#include <bits/stdc++.h>
#include <future>
using namespace std;
const int THRESHOLD=10000;

void merge_range(vector<int>& a,int l,int m,int r){
    vector<int> L(a.begin()+l,a.begin()+m+1);
    vector<int> R(a.begin()+m+1,a.begin()+r+1);
    int i=0,j=0,k=l;
    while(i<(int)L.size()&&j<(int)R.size())
        a[k++]=(L[i]<=R[j])?L[i++]:R[j++];
    while(i<(int)L.size()) a[k++]=L[i++];
    while(j<(int)R.size()) a[k++]=R[j++];
}
void parallelMergeSort(vector<int>& a,int l,int r,int depth=0){
    if(l>=r) return;
    int m=l+(r-l)/2;
    if(r-l<THRESHOLD||depth>3){
        parallelMergeSort(a,l,m,depth+1);
        parallelMergeSort(a,m+1,r,depth+1);
    } else {
        auto f=async(launch::async,
            [&]{parallelMergeSort(a,l,m,depth+1);});
        parallelMergeSort(a,m+1,r,depth+1);
        f.get();
    }
    merge_range(a,l,m,r);
}
int main(){
    vector<int> data(100000);
    iota(data.begin(),data.end(),0);
    shuffle(data.begin(),data.end(),mt19937{42});
    parallelMergeSort(data,0,(int)data.size()-1);
    cout<<"Sorted: "<<(is_sorted(data.begin(),data.end())?"yes":"no")<<"\\n";
}`,
      java: `import java.util.*;
import java.util.concurrent.*;

public class ParallelMergeSort {
    static final int THRESHOLD=10_000;
    static final ForkJoinPool pool=new ForkJoinPool();

    static class Task extends RecursiveAction {
        int[] arr,temp; int lo,hi;
        Task(int[] arr,int[] temp,int lo,int hi){
            this.arr=arr;this.temp=temp;this.lo=lo;this.hi=hi;
        }
        protected void compute(){
            if(hi-lo<2) return;
            int mid=(lo+hi)/2;
            if(hi-lo<THRESHOLD){
                new Task(arr,temp,lo,mid).compute();
                new Task(arr,temp,mid,hi).compute();
            } else {
                invokeAll(new Task(arr,temp,lo,mid),
                          new Task(arr,temp,mid,hi));
            }
            merge(arr,temp,lo,mid,hi);
        }
    }
    static void merge(int[] a,int[] t,int lo,int mid,int hi){
        System.arraycopy(a,lo,t,lo,hi-lo);
        int i=lo,j=mid,k=lo;
        while(i<mid&&j<hi) a[k++]=(t[i]<=t[j])?t[i++]:t[j++];
        while(i<mid) a[k++]=t[i++];
    }
    public static void main(String[] args){
        int[] arr=new int[100_000];
        Random rng=new Random(42);
        for(int i=0;i<arr.length;i++) arr[i]=rng.nextInt();
        pool.invoke(new Task(arr,arr.clone(),0,arr.length));
        boolean sorted=true;
        for(int i=1;i<arr.length;i++) if(arr[i]<arr[i-1]){sorted=false;break;}
        System.out.println("Sorted: "+sorted);
    }
}`,
    },
  },
  {
    name: "Closest Pair of Points — Warehouse Proximity",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    code: {
      python: `import math
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class Point:
    x: float; y: float; label: str=""

def dist(a: Point, b: Point) -> float:
    return math.hypot(a.x-b.x, a.y-b.y)

def brute_force(pts: List[Point]) -> Tuple[float,Point,Point]:
    best = (float('inf'), pts[0], pts[1])
    for i in range(len(pts)):
        for j in range(i+1,len(pts)):
            d=dist(pts[i],pts[j])
            if d<best[0]: best=(d,pts[i],pts[j])
    return best

def strip_closest(strip: List[Point], d: float) -> Tuple[float,Point,Point]:
    strip.sort(key=lambda p: p.y)
    best=(d,strip[0],strip[1] if len(strip)>1 else strip[0])
    for i in range(len(strip)):
        j=i+1
        while j<len(strip) and (strip[j].y-strip[i].y)<best[0]:
            c=dist(strip[i],strip[j])
            if c<best[0]: best=(c,strip[i],strip[j])
            j+=1
    return best

def closest_pair(pts: List[Point]) -> Tuple[float,Point,Point]:
    """D&C closest pair — find nearest warehouses."""
    if len(pts)<=3: return brute_force(pts)
    mid=len(pts)//2; mpx=pts[mid].x
    left=closest_pair(pts[:mid]); right=closest_pair(pts[mid:])
    best=left if left[0]<right[0] else right
    strip=[p for p in pts if abs(p.x-mpx)<best[0]]
    if len(strip)>=2:
        sc=strip_closest(strip,best[0])
        if sc[0]<best[0]: best=sc
    return best

if __name__ == "__main__":
    pts=[Point(0,0,"W1"),Point(3,4,"W2"),Point(1,1,"W3"),
         Point(7,3,"W4"),Point(5,5,"W5"),Point(2,8,"W6")]
    pts.sort(key=lambda p: p.x)
    d,a,b=closest_pair(pts)
    print(f"Closest: {a.label} -- {b.label}  dist={d:.2f}")`,
      cpp: `#include <bits/stdc++.h>
using namespace std;
struct Point { double x,y; string label; };
double dist(const Point& a,const Point& b){return hypot(a.x-b.x,a.y-b.y);}
struct Result { double d; Point a,b; };

Result brute(vector<Point>& pts,int lo,int hi){
    Result best{1e18,pts[lo],pts[lo<hi?lo+1:lo]};
    for(int i=lo;i<hi;i++)
        for(int j=i+1;j<=hi;j++){
            double d=dist(pts[i],pts[j]);
            if(d<best.d) best={d,pts[i],pts[j]};
        }
    return best;
}
Result closestPair(vector<Point>& pts,int lo,int hi){
    if(hi-lo<=2) return brute(pts,lo,hi);
    int mid=(lo+hi)/2; double mx=pts[mid].x;
    Result L=closestPair(pts,lo,mid);
    Result R=closestPair(pts,mid+1,hi);
    Result best=L.d<R.d?L:R; double d=best.d;
    vector<Point> strip;
    for(int i=lo;i<=hi;i++) if(abs(pts[i].x-mx)<d) strip.push_back(pts[i]);
    sort(strip.begin(),strip.end(),[](auto&a,auto&b){return a.y<b.y;});
    for(size_t i=0;i<strip.size();i++)
        for(size_t j=i+1;j<strip.size()&&(strip[j].y-strip[i].y)<d;j++){
            double dd=dist(strip[i],strip[j]);
            if(dd<best.d) best={dd,strip[i],strip[j]};
        }
    return best;
}
int main(){
    vector<Point> pts={{0,0,"W1"},{3,4,"W2"},{1,1,"W3"},
                       {7,3,"W4"},{5,5,"W5"},{2,8,"W6"}};
    sort(pts.begin(),pts.end(),[](auto&a,auto&b){return a.x<b.x;});
    auto r=closestPair(pts,0,(int)pts.size()-1);
    printf("Closest: %s -- %s  dist=%.2f\\n",
        r.a.label.c_str(),r.b.label.c_str(),r.d);
}`,
      java: `import java.util.*;

public class ClosestPair {
    record Point(double x, double y, String label){}
    record Result(double d, Point a, Point b){}

    static double dist(Point a,Point b){return Math.hypot(a.x()-b.x(),a.y()-b.y());}

    static Result brute(List<Point> pts,int lo,int hi){
        Result best=new Result(Double.MAX_VALUE,pts.get(lo),pts.get(lo));
        for(int i=lo;i<hi;i++)
            for(int j=i+1;j<=hi;j++){
                double d=dist(pts.get(i),pts.get(j));
                if(d<best.d()) best=new Result(d,pts.get(i),pts.get(j));
            }
        return best;
    }
    static Result solve(List<Point> pts,int lo,int hi){
        if(hi-lo<=2) return brute(pts,lo,hi);
        int mid=(lo+hi)/2; double mx=pts.get(mid).x();
        Result L=solve(pts,lo,mid),R=solve(pts,mid+1,hi);
        Result best=L.d()<R.d()?L:R; double d=best.d();
        List<Point> strip=new ArrayList<>();
        for(int i=lo;i<=hi;i++)
            if(Math.abs(pts.get(i).x()-mx)<d) strip.add(pts.get(i));
        strip.sort(Comparator.comparingDouble(Point::y));
        for(int i=0;i<strip.size();i++)
            for(int j=i+1;j<strip.size()&&
                    (strip.get(j).y()-strip.get(i).y())<d;j++){
                double dd=dist(strip.get(i),strip.get(j));
                if(dd<best.d()) best=new Result(dd,strip.get(i),strip.get(j));
            }
        return best;
    }
    public static void main(String[] args){
        List<Point> pts=new ArrayList<>(List.of(
            new Point(0,0,"W1"),new Point(3,4,"W2"),new Point(1,1,"W3"),
            new Point(7,3,"W4"),new Point(5,5,"W5"),new Point(2,8,"W6")));
        pts.sort(Comparator.comparingDouble(Point::x));
        Result r=solve(pts,0,pts.size()-1);
        System.out.printf("Closest: %s -- %s  dist=%.2f%n",
            r.a().label(),r.b().label(),r.d());
    }
}`,
    },
  },
];

// ── Repo Tree ──────────────────────────────────────────────────────────────────

const REPO_TREE = `logistics-optimizer/
├── sorting/
│   ├── merge_sort.py
│   ├── quick_sort.py
│   └── heap_sort.py
├── graph/
│   ├── dijkstra.py
│   ├── bellman_ford.py
│   └── prim_mst.py
├── greedy/
│   ├── activity_selection.py
│   ├── fractional_knapsack.py
│   └── job_scheduling.py
├── dynamic_programming/
│   ├── knapsack_01.py
│   └── floyd_warshall.py
└── divide_conquer/
    ├── parallel_merge_sort.py
    └── closest_pair.py`;

// ── AlgoCard ───────────────────────────────────────────────────────────────────

const LANGS: Lang[] = ["python", "cpp", "java"];

function AlgoCard({ algo }: { algo: AlgoSnippet }) {
  const [lang, setLang] = useState<Lang>("python");
  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold text-foreground leading-tight">
            {algo.name}
          </CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-primary/40 text-primary/80"
            >
              T: {algo.timeComplexity}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-accent/40 text-accent/80"
            >
              S: {algo.spaceComplexity}
            </Badge>
          </div>
        </div>
        <div className="flex gap-1 mt-1">
          {LANGS.map((l) => (
            <button
              key={`lang-${algo.name}-${l}`}
              type="button"
              onClick={() => setLang(l)}
              data-ocid={`algo.lang_tab.${l}`}
              className={`px-3 py-1 rounded text-xs font-mono transition-smooth ${
                lang === l
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {l === "cpp" ? "C++" : l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <CodeBlock code={algo.code[lang]} language={lang} maxHeight="460px" />
      </CardContent>
    </Card>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

const MODULES = [
  { id: "sorting", label: "Sorting Algorithms", algos: SORTING_ALGOS },
  { id: "graph", label: "Graph Algorithms", algos: GRAPH_ALGOS },
  { id: "greedy", label: "Greedy Algorithms", algos: GREEDY_ALGOS },
  { id: "dp", label: "Dynamic Programming", algos: DP_ALGOS },
  { id: "dc", label: "Divide & Conquer", algos: DC_ALGOS },
];

export function CodePage() {
  return (
    <div className="min-h-screen bg-background" data-ocid="code.page">
      {/* Header */}
      <div className="bg-card border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground leading-tight">
                Algorithm Implementations
              </h1>
              <p className="mt-1.5 text-muted-foreground text-base">
                Production-ready code for all 5 optimization modules — Python,
                C++ &amp; Java
              </p>
            </div>
            <a
              href="https://github.com"
              data-ocid="code.github_button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 bg-muted/40 text-sm font-medium text-foreground hover:bg-muted/80 hover:border-primary/40 transition-smooth self-start"
            >
              <Github className="w-4 h-4" />
              Star on GitHub
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: "Modules", value: "5" },
              { label: "Algorithms", value: "13" },
              { label: "Languages", value: "3" },
              { label: "GitHub Ready", value: "✓" },
            ].map((s) => (
              <div
                key={`stat-${s.label}`}
                className="px-3 py-1.5 rounded-lg bg-muted/30 border border-border/30 flex items-center gap-2"
              >
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <span className="text-sm font-semibold text-foreground">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Module Tabs */}
        <Tabs defaultValue="sorting" data-ocid="code.module_tabs">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-card border border-border/40 p-1.5 rounded-xl mb-6">
            {MODULES.map((m) => (
              <TabsTrigger
                key={`tab-${m.id}`}
                value={m.id}
                data-ocid={`code.tab.${m.id}`}
                className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {m.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {MODULES.map((m) => (
            <TabsContent key={`content-${m.id}`} value={m.id}>
              <div className="space-y-6" data-ocid={`code.${m.id}.list`}>
                {m.algos.map((algo) => (
                  <AlgoCard key={`algo-${m.id}-${algo.name}`} algo={algo} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* GitHub Repo Structure */}
        <section data-ocid="code.repo_tree">
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-display font-semibold text-foreground">
              GitHub Repository Structure
            </h2>
          </div>

          <Card className="border-border/40 overflow-hidden">
            <CardHeader className="py-2.5 px-4 border-b border-border/30 bg-card flex-row items-center justify-between">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-destructive/60" />
                <span className="w-3 h-3 rounded-full bg-accent/60" />
                <span className="w-3 h-3 rounded-full bg-[oklch(0.62_0.20_145)]/60" />
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                logistics-optimizer/
              </span>
              <button
                type="button"
                data-ocid="code.copy_tree_button"
                onClick={() => navigator.clipboard.writeText(REPO_TREE)}
                className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                aria-label="Copy repo tree"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </CardHeader>
            <div className="bg-[oklch(0.10_0.008_262)] p-5 overflow-x-auto">
              <pre className="text-sm font-mono text-[oklch(0.75_0.012_262)] leading-relaxed whitespace-pre">
                {REPO_TREE}
              </pre>
            </div>
          </Card>

          {/* File grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { file: "merge_sort.py", desc: "Sort deliveries by deadline" },
              { file: "quick_sort.py", desc: "Sort by customer priority" },
              { file: "heap_sort.py", desc: "Dynamic VIP priority queue" },
              { file: "dijkstra.py", desc: "Shortest path min-heap" },
              { file: "bellman_ford.py", desc: "Paths with negative edges" },
              { file: "prim_mst.py", desc: "Minimum spanning network" },
              {
                file: "activity_selection.py",
                desc: "Max non-overlapping jobs",
              },
              {
                file: "fractional_knapsack.py",
                desc: "Optimal load by value/weight",
              },
              {
                file: "job_scheduling.py",
                desc: "Deadline profit maximization",
              },
              { file: "knapsack_01.py", desc: "0/1 DP optimal selection" },
              { file: "floyd_warshall.py", desc: "All-pairs shortest paths" },
              {
                file: "parallel_merge_sort.py",
                desc: "Multi-threaded sorting",
              },
              { file: "closest_pair.py", desc: "Nearest warehouse pair D&C" },
            ].map((item) => (
              <div
                key={`file-${item.file}`}
                className="flex items-start gap-2 px-3 py-2 rounded-lg bg-muted/20 border border-border/30"
              >
                <span className="text-xs font-mono text-primary/70 mt-0.5 shrink-0">
                  {item.file}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

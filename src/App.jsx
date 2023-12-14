import { useInfiniteQuery } from "@tanstack/react-query"
import InfiniteScroll from "react-infinite-scroll-component"

const getCards = async ({pageParam = 0}) => {
  const res = await fetch(`http://localhost:5000/api/v1/allproducts?limit=9&offset=${pageParam}`)
  const data = await res.json()
  return { ...data, prevOffset: pageParam}
}

function App() {
  const {data, fetchNextPage, hasNextPage} = useInfiniteQuery({
    queryKey: ['card'],
    queryFn: getCards,
    getNextPageParam: (lastPage) => {
      if(lastPage.prevOffset + 9 > lastPage.productCount) {
        return false;
      }
      return lastPage.prevOffset + 1
    }
  })

    const products = data?.pages.reduce((acc,page) => {
      return [...acc, ...page.products]
    },[])

    console.log(products)


  console.log(data)
  return (
    <>
    Hello
    <InfiniteScroll
    dataLength={products ? products.length : 0}
    next={() => fetchNextPage()}
    hasMore={hasNextPage}
    loader={<h1 className="text-5xl">Loading...........</h1>}
    endMessage={<p className="text-3xl font-bold">This is the end</p>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {
          products && products.map((product, index) => (
           <div key={index}
           className="border border-solid border-red-500 space-y-6 flex flex-col justify-center items-center p-5"
           >
             <img src={product.image} alt="" />
             <h1>{product.productTitle }</h1>
            <p>{product.regularPrice}</p>
           </div>
          ))
        }
      </div>
    </InfiniteScroll>
    </>
  )
}

export default App

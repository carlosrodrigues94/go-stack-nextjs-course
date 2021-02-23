import { useRouter } from 'next/router'


function Product() {
  const router  = useRouter()

  return <div  style={{margin:'40px'}}>{router.query.slug}</div>
}

export default Product
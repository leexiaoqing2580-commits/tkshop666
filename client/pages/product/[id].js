import Header from '../../components/Header'
import useSWR from 'swr'
import {useRouter} from 'next/router'
const fetcher = url=>fetch(url).then(r=>r.json())
export default function Product(){ const router = useRouter(); const { id } = router.query; const { data } = useSWR(id?`/api/proxy/products/${id}`:null, fetcher); if(!data) return <div>Loading...</div>;
 return (<div><Header/><div className='container' style={{paddingTop:18}}><div className='card' style={{display:'flex',gap:18}}><div style={{flex:1}}><img src={data.image} style={{width:'100%',height:360,objectFit:'cover'}}/></div><div style={{width:380}}><h2>{data.title}</h2><p>{data.description}</p><div style={{marginTop:12}} className='button'>Buy (demo)</div></div></div></div></div>) }
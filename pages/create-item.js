import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import config from '../constants/config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const nftaddress = config.NFT_ADDRESS;
  const nftmarketaddress = config.NFT_MARKET_ADDRESS;

  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')
  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col py-10">
        <h1 className="text-3xl font-bold mb-5">Create Digital Asset</h1>
        <div className="mb-3">
          <label className={`${fileUrl ? 'w-full':'w-64 px-4 py-6 text-gray-500 border-dashed'} rounded-lg border border-gray-200 flex flex-col items-center cursor-pointer`}>
            {
              fileUrl ? (
                <img className="rounded-xl mb-4" width="350" src={fileUrl} />
              ):
              <>
                {/* <UploadIcon/> */}
                <span className="mt-2 text-sm leading-normal">Click to select a file</span>
              </>
            }
            <input
              type="file"
              name="Asset"
              className="hidden"
              onChange={onChange}
            />
          </label>
        </div>
        <input 
          placeholder="Asset Name"
          className="mb-3 border rounded-xl outline-none focus:border-gray-400 p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mb-3 border rounded-xl outline-none focus:border-gray-400 p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Asset Price in ETH"
          className="mb-3 border rounded-xl outline-none focus:border-gray-400 p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        
        <button onClick={createMarket} className="font-medium mb-4 bg-blue-500 text-white rounded-xl p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
  )
}

const UploadIcon = () => {
  return(
    <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
  )
}
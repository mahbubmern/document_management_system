import axios from 'axios'

export const sendSMS = async(to, msg)=>{
await axios.get(`http://bulksmsbd.net/api/smsapi?api_key=1asMt86ueRjrAd9xbPfz&type=text&number=${to}Receiver&senderid=8809617000000&message=${msg}`)
}


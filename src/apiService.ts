import { signedFetch } from '@decentraland/SignedFetch'

declare type TUserData = {
  userAccount: string,
  userName: string,
}

export class ApiService {
  private url: string = 'https://dcl.web3ads.net/wolt'

  async checkIsWearableClaimed (body: {claim: string, userData: TUserData}) {
    try {
      const isWearableWasClaimedRes = await signedFetch(`${this.url}/${body.claim}/claimed/${body.userData.userAccount}`, {
        responseBodyType: 'json'
      })
      return await isWearableWasClaimedRes.json
    } catch (err) {
      return { error: 'Unknown error' }
    }
  }

  async claimWearable (body: {claim: string, userData: TUserData}) {
    try {
      const response = await signedFetch(`${this.url}/${body.claim}/claims`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body.userData),
        responseBodyType: 'json'
      })
      return await response.json
    } catch (err) {
      return { error: 'Unknown error' }
    }
  }
}

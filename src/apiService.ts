import { getUserData } from '@decentraland/Identity'

declare type TScore = {
  userAccount: string,
  userName: string,
  score: number
}

declare type TUserData = {
  userAccount: string,
  userName: string,
}

export class ApiService {
  private url: string = 'https://dcl.web3ads.net/wolt'

  async checkIsWearableClaimed (body: {claim: string, userData: TUserData}) {
    try {
      const isWearableWasClaimedRes = await fetch(`${this.url}/${body.claim}/claimed/${body.userData.userAccount}`)
      return await isWearableWasClaimedRes.json()
    } catch (err) {
      log(err)
    }
  }

  async claimWearable (body: {claim: string, userData: TUserData}) {
    try {
      const isWearableWasClaimed = await this.checkIsWearableClaimed(body)
      if(isWearableWasClaimed.claimed){
        return {wasClaimed: isWearableWasClaimed.claimedAt}
      } else{
        await fetch(`${this.url}/${body.claim}/claims`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body.userData)
        })
        return { wasClaimed: null}
      }
    } catch (err) {
      log(err)
    }
  }
}

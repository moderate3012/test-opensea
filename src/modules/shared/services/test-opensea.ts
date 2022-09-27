
import fetch from 'node-fetch'
export class TestOpenSeaService {
    constructor() {
        void this.start()

    }

    async start() {
        try {
            const baseURL = "https://api.opensea.io/api/v1"
            const contract_address = '0x197492ccb4b1acaaacd43432657a17832e36ab49'
            let response = await fetch(`${baseURL}/asset/${contract_address}/1/?force_update=true`, {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                    "X-API-KEY": ""
                }
            })
            console.log(response);
            if (response) response = await response.json()
            if (response) {
                console.log(response)
            }
        } catch (error) {
            console.log(error);
        }
    }
}
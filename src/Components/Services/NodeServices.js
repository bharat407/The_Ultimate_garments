import axios from "axios"

const ServerURL = "http://localhost:5000"

const postData = async (url, body, isFile = false) => {
    try {
        const headers = {
            headers: {
                "content-type": isFile ? "multipart/form-data" : "application/json",
            }
        }

        var response = await axios.post(`${ServerURL}/${url}`, body, headers)
        var result = await response.data
        return (result)
    }
    catch (error) {
        return (false)
    }
}

const getData = async (url) => {
    try {
        var response = await fetch(`${ServerURL}/${url}`)
        var result = await response.json()
        return (result)
    }
    catch (error) {
        return (null)
    }
}

const getToken = async () => {
    var response = await fetch(`${ServerURL}/admin/getToken`)
    var result = await response.json()

    return (result.token)
}

const isValidAuth = async () => {
    try {
        var token = await getToken()
        console.log("Get Token", token)
        var response = await fetch(`${ServerURL}/admin/isUserAuth`, {
            headers: { 'authorization': token }
        })
        var result = await response.json()
        return (result)
    }
    catch (error) {
        return (null)
    }
}

const clearToken = async () => {
    try {
        var response = await fetch(`${ServerURL}/admin/cleartoken`)
        var result = await response.json()
        return (result)
    }
    catch (error) {
        return (null)
    }
}

export { ServerURL, postData, getData, isValidAuth, clearToken }


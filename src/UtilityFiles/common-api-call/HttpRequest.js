export const methodType = {
    POST: 'POST',
    GET: 'GET',
    DELETE: 'DELETE',
    UPDATE: 'UPDATE',
    PUT: 'PUT',
    PATCH: 'PATCH',
}

export const callHttpRequest = (data) => {
    if (data) {
        let body = data.body;
        let url = data.url;
        let headers = { headers: data.headers }
        switch (data.methodType) {
            case methodType.GET:
                return ApiHelper.get(url, headers)
            case methodType.POST:
                return ApiHelper.post(url, body, headers)
            case methodType.PUT:
                return ApiHelper.put(url, body, headers)
            case methodType.DELETE:
                return ApiHelper.delete(url, { headers: headers, data: body })
        }
    }
}
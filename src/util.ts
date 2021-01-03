function getQuery (url: string) {
    return new URL(url).searchParams
}

export {
    getQuery
}

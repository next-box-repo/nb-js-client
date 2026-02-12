export interface Versions {
    current_version: {
        number: string,
        name: string,
        date: Date,
        url_changelog?: string
    },
    last_version: {
        number: string,
        name: string,
        date: Date,
        url_changelog?: string
    }
}
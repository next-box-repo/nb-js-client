export interface PlatformVersions {
    current_version: Version,
    last_version: Version,
}

export interface Version {
    number: string,
    name: string,
    date: Date,
    url_changelog?: string
}
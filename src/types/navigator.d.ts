interface ShareData {
    title?: string
    text?: string
    url?: string
    files?: File[];
}

declare interface Navigator {
    share?(data: ShareData): Promise<undefined>
}

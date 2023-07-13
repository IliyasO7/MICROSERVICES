const BunnyStorage = require('bunnycdn-storage').default

// Upload file
exports.uploadToBunnyCdn = async (params) => {
    try {

        // Params: [fileData, savingPath]

        const bunnyStorage = await new BunnyStorage(process.env.BUNNYCDN_API_KEY, process.env.BUNNYCDN_STORAGE_ZONE)

        await bunnyStorage.upload(params.fileData, params.savingPath)

        return true

    } catch (err) {
        throw err
    }
}
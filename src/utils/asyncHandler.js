const asyncHandler = (functionHandler) => {
    (req, res, next) => {
        Promise.resolve(functionHandler(req, res, next)).catch((error) => next(error))
    }
}

export { asyncHandler }

const asyncHandler1 = (fun) => async (req, res, next) => {
    try {
        await fun(req, res, next)
    } catch (error) {
        res.statu(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

export { asyncHandler1 }
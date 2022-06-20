const advancedResult = (model, populate) => async (req, res, next) => {

    let query;

    //Copy req.query
    const reqQuery = { ...req.query }
    console.log(reqQuery);

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    //Create query string
    let quaryStr = JSON.stringify(reqQuery)

    //Create operators ($gt, $gte, etc)
    quaryStr = quaryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    //Finding resorce
    query = model.find(JSON.parse(quaryStr));

    //select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }

    //Sort 
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit
    const total = await model.countDocuments()

    query = query.skip(startIndex).limit(limit);
    // console.log(query);


    if (populate) {
        query = query.populate(populate);
    }

    //Executinig query
    const results = await query

    //Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        sucess: true,
        count: results.length,
        pagination,
        data: results
    }

    next();

}




module.exports = advancedResult
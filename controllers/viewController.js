// move funtions of the viewRoutes to viewController.js

exports.getOverview = (req, res, next) => {

    res.status(200).render('overview', {
        title: 'All Tours',
    });
}

exports.getTour = (req, res, next) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour'
    });
}
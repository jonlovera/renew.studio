/**
 * 401 (Unauthorized) Handler
 *
 * Usage:
 * return res.forbidden();
 * return res.forbidden(err);
 * return res.forbidden(err, 'some/specific/forbidden/view');
 *
 * e.g.:
 * ```
 * return res.forbidden('Access denied.');
 * ```
 */

module.exports = function forbidden(data, options) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    if (!req.wantsJSON) {
        if (!req.options.locals) req.options.locals = config.defaultHead;

        req.options.locals.status = 401;
        req.options.locals.title = 'Unauthorized | ' + config.companyName;
    }
    // Set status code
    res.status(401);

    // Log error to console
    if (data !== undefined) {
        sails.log.verbose('Sending 401 ("Unauthorized") response: \n', data);
    } else sails.log.verbose('Sending 401 ("Unauthorized") response');

    // If the user-agent wants JSON, always respond with JSON
    if (req.wantsJSON) {
        return res.jsonx(data);
    }

    // If second argument is a string, we take that to mean it refers to a view.
    // If it was omitted, use an empty object (`{}`)
    options = (typeof options === 'string') ? {
        view: options
    } : options || {};

    // If a view was provided in options, serve it.
    // Otherwise try to guess an appropriate view, or if that doesn't
    // work, just send JSON.
    if (options.view) {
        return res.view(options.view, {
            data: data
        });
    }

    // If no second argument provided, try to serve the default view,
    // but fall back to sending JSON(P) if any errors occur.
    else return res.view('401', {
        data: data
    }, function(err, html) {

        // If a view error occured, fall back to JSON(P).
        if (err) {
            //
            // Additionally:
            // • If the view was missing, ignore the error but provide a verbose log.
            if (err.code === 'E_VIEW_FAILED') {
                sails.log.verbose('res.forbidden() :: Could not locate view for error page (sending JSON instead).  Details: ', err);
            }
            // Otherwise, if this was a more serious error, log to the console with the details.
            else {
                sails.log.warn('res.forbidden() :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
            }
            return res.jsonx(data);
        }

        return res.send(html);
    });

};
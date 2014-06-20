
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("mschema-mschema/index.js", function(exports, require, module){
var mschema = {};

mschema.types = {
  "string": function (val) {
    return typeof val === "string";
  },
  "number": function (val) {
    return typeof val === "number";
  },
  "boolean": function (val) {
    return typeof val === "boolean";
  },
  "object": function (val) {
    return typeof val === "object";
  },
  "any": function (val) {
    return true;
  }
};

var validate = mschema.validate = function (_data, _schema, options) {

  var result = { valid: true, instance: {} },
      errors = [],
      options = options || {};

  if (typeof options.strict === "undefined") {
    options.strict = true;
  }

  if (typeof _schema !== 'object') {
    return 'schema contains no properties, cannot validate';
  }

  function _parse (data, schema) {

    // iterate through properties and compare values to types
    for (var propertyName in schema) {

      // extract property type
      var property = schema[propertyName];

      // extract corresponding data value
      var value = data[propertyName];

      function parseConstraint (property, value) {

        if (typeof property === "string" && (property === 'string' || property === 'number' || property === 'object' || property === 'array' || property === 'boolean' || property === 'any')) {
          property = {
            "type": property,
            "required": false
          };
        }

        // if value is undefined and a default value is specified
        if (typeof property.default !== 'undefined' && typeof value === 'undefined') {
          // assign default value
          value = property.default;
          data[propertyName] = value;
        }

        if (options.strict === false) {
          var _value;
          // determine if any incoming data might need to be changed from a string number into a Number type
          if (typeof value === "string" && (property === "number" || property.type === "number")) {
            _value = parseInt(data[propertyName], 10);
            if (_value.toString() !== "NaN") {
              // a non NaN number was parsed, assign it as validation value and to instance value
              value = _value;
              data[propertyName] = value;
            }
          }
        }

        // check if it's value is required but undefined in value
        if (property.required && (value === null || value === undefined || value.length === 0)) {
          errors.push({
            property: propertyName,
            constraint: 'required',
            expected: true,
            actual: false,
            value: value,
            message: 'Required value is missing'
          });
          // if the value is required and missing, don't check for any other constraints
          return;
        }

        if (typeof property === 'object') {
          // determine if we are at the end of the branch ( constraints ), or simply another nested property
          var nested = false;
          for (var p in property) {
            if (typeof property[p] === 'object' && p !== 'enum' && p!== 'regex') { // enum and regex properties are a special case since they accept array / object as values
              nested = true;
            }
          }
          if(!nested) {
            property.required = false;
          }
        }


        // if an undefined value has been sent to a non-required property,
        // ignore the property and continue the validation
        if (value === undefined && property.required === false) {
          return;
        }

        if (typeof property.regex === 'object') {
          var re = property.regex
          var result = re.exec(value);
          if (result === null) {
            errors.push({
              property: propertyName,
              constraint: 'regex',
              expected: property.regex,
              actual: value,
              value: value,
              message: 'Regex does not match string'
            });
            return;
          }
        }

        if (propertyName === "properties") {
          if(typeof data === "object") {
            Object.keys(data).forEach(function(key){
              _parse(data[key], property);
            });
            return;
          } else {
            errors.push({
              property: propertyName,
              constraint: 'type',
              expected: "object",
              actual: typeof value,
              value: value,
              message: 'Invalid value for properties'
            });
            return;
          }
          return;
        }

        if (typeof value === "object") {
          _parse(value, property);
          return;
        } else {

          if (nested === true) {

            if (property.required === true && typeof value !== 'object') {
              errors.push({
                property: propertyName,
                constraint: 'type',
                expected: "object",
                actual: typeof value,
                value: value,
                message: 'Invalid value for object type'
              });
            }

            if (property.required !== true && typeof value !== 'object') {

              if (typeof value === 'undefined') {
                value = {};
                data[propertyName] = {};
              } else {
                errors.push({
                  property: propertyName,
                  constraint: 'type',
                  expected: "object",
                  actual: typeof value,
                  value: value,
                  message: 'Invalid value for object type'
                });
              }
            }

            return;
          }

          for (var constraint in property) {
            if (typeof property[constraint] === "object") {
              if (typeof value === 'object') {
                _parse(value, property);
                return;
              } else {
                checkConstraint(propertyName, constraint, property[constraint], value, errors);
              }
            } else {
              checkConstraint(propertyName, constraint, property[constraint], value, errors);
            }
          }
        }

      }

      // TODO: remove this check and instead create object literal to represent array type
      // { type: 'array', required: false }
      // if the property is an array, assume it has a single value of either string or object type
      if (Array.isArray(property) === true) {

        // if the array has more then one element, it is most likely a syntax error in the schema definition from the user
        if (property.length > 1) {
          errors.push({
            property: property,
            constraint: 'type',
            expected: "Single element array",
            actual: value.length + " element array",
            value: value.toString(),
            message: 'Typed arrays can only be of one type'
          });
        }

        // check if the value provided is an array
        if (!Array.isArray(value)) {
          if (typeof value === "undefined") {
            value = [];
          } else {
            // if the value provided is not an array, validation fails
            errors.push({
              property: propertyName,
              constraint: 'type',
              expected: "array",
              actual: typeof value,
              value: value,
              message: 'Value is not an array'
            });
          }
          continue;
        }
        // iterate through every value in the array check and for validity
        if (property.length === 0) {
          continue;
        } else {
          value.forEach(function(item){
            parseConstraint(property[0], item);
          });
        }
      }

      else { // if property is not of type Array
        parseConstraint(property, value);
      }

    }

  }


  // create a clone of the schema so the original schema passed is not modifed by _parse()
  var schemaCopy = {};
  schemaCopy = clone(_schema);

  // if the incoming data is not an object, create a single key object to represent it
  if (typeof _data !== "object") {
    _data = {
      key: _data
    };
    schemaCopy = {
      key: schemaCopy
    }
  }
  _parse(_data, schemaCopy);

  // TODO: clone data to fix immutable data issue
  // see: /test/immutable-data.js
  //  var dataCopy = clone(_data);
  // _parse(dataCopy, schemaCopy);

  result.instance = _data;

  if (errors.length > 0) {
    result.valid = false;
  }

  result.errors = errors;
  return result;
};

var checkConstraint = mschema.checkConstraint = function (property, constraint, expected, value, errors) {

  switch (constraint) {

    case 'type':
      if (!mschema.types[expected](value)) {
        errors.push({
          property: property,
          constraint: 'type',
          value: value,
          expected: expected,
          actual: typeof value,
          message: 'Type does not match'
        });
      }
    break;

    case 'minLength':
      if (expected > value.length) {
        errors.push({
          property: property,
          constraint: 'minLength',
          value: value,
          expected: expected,
          actual: value.length,
          message: 'Value was below minLength of property'
        });
      }
    break;

    case 'maxLength':
      if (expected <= value.length) {
        errors.push({
          property: property,
          constraint: 'maxLength',
          value: value,
          expected: expected,
          actual: value.length,
          message: 'Value exceeded maxLength of property'
        });
      }
    break;

    case 'min':
      if (expected > value) {
        errors.push({
          property: property,
          constraint: 'min',
          expected: expected,
          actual: value,
          value: value,
          message: 'Value was below min of property'
        });
      }
    break;

    case 'max':
      if (expected < value) {
        errors.push({
          property: property,
          constraint: 'max',
          expected: expected,
          actual: value,
          value: value,
          message: 'Value execeed max of property'
        });
      }
    break;

    case 'enum':
      if (expected.indexOf(value) === -1) {
        errors.push({
          property: property,
          constraint: 'enum',
          expected: expected,
          actual: value,
          value: value,
          message: 'Value is not part of enum set'
        });
      }
    break;

    default:
      // console.log('missing constraint - ' + constraint);
    break;

  }

};

function clone (obj, copy) {
  if (obj == null || typeof obj != "object") {
    return obj;
  }
  if (obj.constructor != Object && obj.constructor != Array) {
    return obj;
  }
  if (obj.constructor == Date || obj.constructor == RegExp || obj.constructor == Function ||
      obj.constructor == String || obj.constructor == Number || obj.constructor == Boolean) {
    return new obj.constructor(obj);
  }
  copy = copy || new obj.constructor();
  for (var name in obj) {
    copy[name] = typeof copy[name] == "undefined" ? clone(obj[name], null) : copy[name];
  }
  return copy;
}

module['exports'] = mschema;
});
require.register("felixge-dateformat/index.js", function(exports, require, module){
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZWN]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		},
    /**
     * Get the ISO 8601 week number
     * Based on comments from
     * http://techblog.procurios.nl/k/n618/news/view/33796/14863/Calculate-ISO-8601-week-and-year-in-javascript.html
     */
    getWeek = function (date) {
      // Remove time components of date
      var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      // Change date to Thursday same week
      targetThursday.setDate(targetThursday.getDate() - ((targetThursday.getDay() + 6) % 7) + 3);

      // Take January 4th as it is always in week 1 (see ISO 8601)
      var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);

      // Change date to Thursday same week
      firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

      // Check if daylight-saving-time-switch occured and correct for it
      var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
      targetThursday.setHours(targetThursday.getHours() - ds);

      // Number of weeks between target Thursday and first Thursday
      var weekDiff = (targetThursday - firstThursday) / (86400000*7);
      return 1 + weekDiff;
    },

    /**
     * Get ISO-8601 numeric representation of the day of the week
     * 1 (for Monday) through 7 (for Sunday)
     */

    getDayOfWeek = function(date){
    	var dow = date.getDay();
    	if(dow === 0) dow = 7;
    	return dow;
    };

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc, gmt) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		date = date || new Date;

    if(!(date instanceof Date)) {
      date = new Date(date);
    }

    if (isNaN(date)) {
      throw TypeError("Invalid date");
    }

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc/gmt argument via the mask
		var maskSlice = mask.slice(0, 4);
		if (maskSlice == "UTC:" || maskSlice == "GMT:") {
			mask = mask.slice(4);
			utc = true;
			if (maskSlice == "GMT:") {
				gmt = true;
			}
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			W = getWeek(date),
			N = getDayOfWeek(date),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    gmt ? "GMT" : utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10],
				W:    W,
				N:    N
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	expiresHeaderFormat: "ddd, dd mmm yyyy HH:MM:ss Z"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

/*
// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
*/

if (typeof exports !== "undefined") {
  module.exports = dateFormat;
}

});
require.register("safewallet/index.js", function(exports, require, module){

});




require.register("safewallet/template.html", function(exports, require, module){
module.exports = '';
});
require.alias("mschema-mschema/index.js", "safewallet/deps/mschema/index.js");
require.alias("mschema-mschema/index.js", "safewallet/deps/mschema/index.js");
require.alias("mschema-mschema/index.js", "mschema/index.js");
require.alias("mschema-mschema/index.js", "mschema-mschema/index.js");
require.alias("felixge-dateformat/index.js", "safewallet/deps/dateformat/index.js");
require.alias("felixge-dateformat/index.js", "safewallet/deps/dateformat/index.js");
require.alias("felixge-dateformat/index.js", "dateformat/index.js");
require.alias("felixge-dateformat/index.js", "felixge-dateformat/index.js");
require.alias("safewallet/index.js", "safewallet/index.js");
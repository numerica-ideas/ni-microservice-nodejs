/**
 * Some useful utilities.
 * @author dassiorleando
 */

/**
 * Default callaback doing nothing
 * @returns {void}
 */
export const noop = function (error: any, data: any): void {
  // Nothing
}

/**
 * Prints error
 * @param {Object} error The error to show
 * @returns {void}
 */
export const error = function (error) {
  console.error('❌ Something went wrong', error);
}

/**
 * To initialize some stuff when starting
 * @param {Object} config The config we defined into the corresponding folder
 * @returns {boolean} If or not we succeeded to initiate the App
 */
export const init = function (config) {
  if (!config) return false;
  console.log('Initing configs ...');
  
  if (!config.JWT_SECRET) {
    console.error('❌ Some env vars are required.');
    return false;
  }

  console.log('Microservice Inited');
  return true;
}

/**
 * Get unique error field name
 */
const getUniqueErrorMessage = function (err) {
  var output;

  try {
    var fieldName = err.errmsg.substring(err.errmsg.lastIndexOf('.$') + 2, err.errmsg.lastIndexOf('_1'));
    output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

  } catch (ex) {
    output = 'Unique field already exists';
  }

  return output;
};

/**
 * Get the error message from error object
 */
export const getErrorMessage = function (err) {
  var message = '';

  if (typeof err === 'string') {
    message = err;
  } else if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = getUniqueErrorMessage(err);
        break;
      case 'LIMIT_FILE_SIZE': // multer error on file size
        message = err.message;
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) {
        message = err.errors[errName].message;
      }
    }
  }

  return message;
};

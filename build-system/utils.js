export function callCb(cb, ...args) {

  if (typeof cb === 'function') {

    cb(...args);

  } else {

    console.trace('Callback is not a function');
    console.log('Passed arguments:', ...args);

  }

}

export function getGlobal() {

  let container = null;

  if (typeof self !== 'undefined') {

    container = self;

  } else if (typeof window !== 'undefined') {

    container = window;

  } else if (typeof globalThis !== 'undefined') {

    container = globalThis;

  } else if (typeof global !== 'undefined') {

    container = global;

  }

  return container;

}

export function readGlobalState(property) {

  return getGlobal()?.[property];

}

export function getObjectValueByString(obj, stringPath) {

  if (typeof obj === 'undefined' || obj === null || typeof obj !== 'object' || typeof stringPath !== 'string') {

    return;

  }

  stringPath = stringPath.replace(/\[(\w+)\]/g, '.$1');
  stringPath = stringPath.replace(/^\./, '');

  const paths = stringPath.split('.');

  for (const key of paths) {

    try {

      if (key in obj) {

        obj = obj[key];

      } else {

        return;

      }
    } catch {

      return;

    }

  }

  return obj;

}

export function addObjectValueByString(obj, stringPath, leafValue, pathArr) {

  if (typeof obj === 'undefined' || obj === null || typeof obj !== 'object' || typeof stringPath !== 'string') {

    return;

  }

  if (typeof pathArr === 'undefined') {

    stringPath = stringPath.replace(/\[(\w+)\]/g, '.$1');
    stringPath = stringPath.replace(/^\./, '');

    const pathArr = stringPath.split('.');

    this.addObjectValueByString(obj, stringPath, leafValue, pathArr)

  }

  if (typeof pathArr === 'undefined' || pathArr.length === 0) {

    return;

  }

  const currentPath = pathArr.shift();

  if (pathArr.length === 0) {

    obj[currentPath] = leafValue;

    return;

  }

  obj[currentPath] = {}

  this.addObjectValueByString(obj[currentPath], stringPath, leafValue, pathArr)

}

export function readValueWithDefault(value, defaultValue, typeCaster = value => value, { nullCheck, undefinedCheck, emptyCharCheck } = {
  nullCheck: true,
  undefinedCheck: true,
  emptyCharCheck: false
}) {

  if (undefinedCheck && !isDefinedValue(value)) {

    return defaultValue;

  }

  if (nullCheck && value === null) {

    return defaultValue;

  }

  if (emptyCharCheck && value === '') {

    return defaultValue;

  }

  return typeCaster(value);

}

export function safeParse(jsonLike, defaultValue = {}) {

  try {

    return JSON.parse(jsonLike);

  } catch {

    return defaultValue;

  }

}

export function isValidObject(objectLike) {

  return (typeof objectLike === 'object' && objectLike !== null && !Array.isArray(objectLike));

}

export function isValidArray(arrayLike) {

  return Array.isArray(arrayLike);

}

export function isDefinedValue(testValue) {

  return (typeof testValue !== 'undefined');

}

export function isNonEmptyObject(objectLike) {

  return (isValidObject(objectLike) && Object.getOwnPropertyNames(objectLike).length > 0);

}

export function isNonEmptyArray(arrayLike) {

  return (isValidArray(arrayLike) && arrayLike.length > 0);

}

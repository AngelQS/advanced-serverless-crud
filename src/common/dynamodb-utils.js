module.exports = {
  marshallItem(item) {
    const marshalledItem = {};
  
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === 'string') {
        marshalledItem[key] = { S: value };
      } else if (typeof value === 'number') {
        marshalledItem[key] = { N: value.toString() };
      } else if (typeof value === 'boolean') {
        marshalledItem[key] = { BOOL: value };
      } else if (value === null) {
        marshalledItem[key] = { NULL: true };
      } else if (Array.isArray(value)) {
        marshalledItem[key] = { L: value.map(this.marshallItem) };
      } else if (typeof value === 'object') {
        marshalledItem[key] = { M: this.marshallItem(value) };
      };
    };
  
    return marshalledItem;
  },
  
  unmarshallItem(item) {
    const unmarshalledItem = {};
  
    for (const [key, value] of Object.entries(item)) {
      if (value.S) {
        unmarshalledItem[key] = value.S;
      } else if (value.N) {
        unmarshalledItem[key] = parseFloat(value.N);
      } else if (value.BOOL) {
        unmarshalledItem[key] = value.BOOL;
      } else if (value.NULL) {
        unmarshalledItem[key] = null;
      } else if (value.L) {
        unmarshalledItem[key] = value.L.map(this.unmarshallItem);
      } else if (value.M) {
        unmarshalledItem[key] = this.unmarshallItem(value.M);
      };
    };
  
    return unmarshalledItem;
  };
};

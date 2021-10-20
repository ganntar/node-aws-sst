export default function validatePlace(place) {
  const schema = {
    name: value => value != "",
    typePeople: value => value != "",
    picture: value => value != ""
  }

  const validate = (object, schema) => Object
    .keys(schema)
    .filter(key => !schema[key](object[key].replace(" ", "")))
    .map(key => new Error(`${key} is invalid.`));

  const errors = validate(place, schema);

  if (errors.length > 0) {
    let stackErrors = '';
    for (const {message} of errors) {
      stackErrors += message + '; ';
    }
    throw new Error(stackErrors);
  }

  return place;
}
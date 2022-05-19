const convertObjectsToArray = async ({
  input,
  property,
  callback,
}: {
  callback?: (input: any) => any;
  input: any;
  property: string;
}) => {
  const array = [];

  for (const id in input) {
    array.push(callback ? await callback(input[id][property]) : input[id][property]);
  }

  return array;
};

export { convertObjectsToArray };

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
    array.push(
      callback ? await callback(input[id][property]) : input[id][property]
    );
  }

  return array;
};

interface paginationI {
  page: string | undefined;
  limit: string | undefined;
}

const getPaginationProperties = ({
  page: rowPage,
  limit: rowLimit,
}: paginationI) => {
  const page = Number(rowPage) || 1;
  const limit = Number(rowLimit) || 10;
  const offset = (page - 1) * limit;
  return { limit, offset };
};

export { convertObjectsToArray, getPaginationProperties };

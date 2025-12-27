import { transformToNestObject } from "react-hook-form";

const parseErrorSchema = (error, validateAllFieldCriteria) => {
  return Array.isArray(error.inner) && error.inner.length
    ? error.inner.reduce((previous, { path, message, type }) => {
        // @ts-expect-error
        const previousTypes = (previous[path] && previous[path].types) || {};
        const key = path || type;
        return Object.assign(
          Object.assign({}, previous),
          key
            ? {
                [key]: Object.assign(
                  Object.assign(
                    {},
                    previous[key] || {
                      message,
                      type
                    }
                  ),
                  validateAllFieldCriteria
                    ? {
                        types: Object.assign(Object.assign({}, previousTypes), {
                          // @ts-expect-error
                          [type]: previousTypes[type]
                            ? // @ts-expect-error
                              [...[].concat(previousTypes[type]), message]
                            : message
                        })
                      }
                    : {}
                )
              }
            : {}
        );
      }, {})
    : {
        // @ts-expect-error
        [error.path]: {
          message: error.message,
          type: error.type
        }
      };
};

const yupResolver =
  (schema, options = { abortEarly: false }) =>
  async (values, context, validateAllFieldCriteria = false) => {
    try {
      if (options.context && process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn(
          "You should not used the yup options context. Please, use the 'useForm' context object instead"
        );
      }
      return {
        values: await schema.validate(
          values,
          Object.assign(Object.assign({}, options), { context })
        ),
        errors: {}
      };
    } catch (e) {
      const parsedErrors = parseErrorSchema(e, validateAllFieldCriteria);
      return {
        values: {},
        errors: transformToNestObject(parsedErrors)
      };
    }
  };

export default yupResolver;

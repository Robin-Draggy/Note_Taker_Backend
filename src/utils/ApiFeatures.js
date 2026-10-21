
export class ApiFeatures {
  constructor(query, queryString, options = {}) {
    this.query = query;
    this.queryString = queryString;
    this.options = options;
  }

  sort() {
    const {
      sort = "-createdAt",
    } = this.queryString;

    const allowedSortFields = this.options.allowedSortFields ?? [
      "createdAt",
      "updatedAt",
    ];

    const sortFields = sort.split(",").map((field) => {
      const trimmedField = field.trim();
      const fieldName = trimmedField.replace(/^-/, "");

      if (
        !fieldName ||
        !allowedSortFields.includes(fieldName)
      ) {
        throw new Error(
          `Invalid sort field: ${fieldName || trimmedField}`
        );
      }

      return trimmedField;
    });

    this.query = this.query.sort(sortFields.join(" "));
    return this;
  }

  select() {
    const { fields } = this.queryString;

    if (!fields) {
      return this;
    }

    const allowedFields = this.options.allowedFields;

    if (!allowedFields) {
      throw new Error(
        "Field selection is not configured for this query."
      );
    }

    const requestedFields = fields
      .split(",")
      .map((field) => field.trim())
      .filter(Boolean);

    const invalidFields = requestedFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new Error(
        `Invalid fields: ${invalidFields.join(", ")}`
      );
    }

    this.query = this.query.select(requestedFields.join(" "));
    return this;
  }

  paginate() {
    const page = this.parsePositiveInteger(
      this.queryString.page,
      "page",
      1
    );

    const limit = this.parsePositiveInteger(
      this.queryString.limit,
      "limit",
      10
    );

    const maxLimit = this.options.maxLimit ?? 50;

    if (limit > maxLimit) {
      throw new Error(
        `Limit cannot exceed ${maxLimit}.`
      );
    }

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    this.pagination = {
      page,
      limit,
      skip,
    };

    return this;
  }

  parsePositiveInteger(value, fieldName, defaultValue) {
    if (value === undefined || value === "") {
      return defaultValue;
    }

    const parsedValue = Number(value);

    if (
      !Number.isSafeInteger(parsedValue) ||
      parsedValue < 1
    ) {
      throw new Error(
        `${fieldName} must be a positive integer.`
      );
    }

    return parsedValue;
  }
}
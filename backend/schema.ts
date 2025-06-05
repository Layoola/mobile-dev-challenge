import { graphql, list } from '@keystone-6/core';
import {
  text,
  integer,
  select,
  relationship,
  timestamp,
  virtual,
} from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';
import type { Lists } from '.keystone/types';

export const lists = {
  InstantNoodle: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
      }),
      brand: text({
        validation: { isRequired: true },
      }),
      spicinessLevel: integer({
        validation: {
          isRequired: true,
          min: 1,
          max: 5,
        },
        defaultValue: 3,
        ui: { description: 'Scale of 1 (mild) to 5 (🔥)' },
      }),
      spicinessDescription: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve(item) {
            const spicinessLevel = item.spicinessLevel;
            if (spicinessLevel <= 2) return 'Mild';
            if (spicinessLevel <= 4) return 'Medium';
            return 'Hot';
          },
        }),
        ui: { description: "Spiciness description from 'Mild'  to 'Hot' (🔥)" },
      }),
      originCountry: select({
        type: 'enum',
        options: [
          { label: 'South Korea', value: 'south_korea' },
          { label: 'Indonesia', value: 'indonesia' },
          { label: 'Malaysia', value: 'malaysia' },
          { label: 'Thailand', value: 'thailand' },
          { label: 'Japan', value: 'japan' },
          { label: 'Singapore', value: 'singapore' },
          { label: 'Vietnam', value: 'vietnam' },
          { label: 'China', value: 'china' },
          { label: 'Taiwan', value: 'taiwan' },
          { label: 'Philippines', value: 'philippines' },
        ],
        validation: { isRequired: true },
      }),
      rating: integer({
        validation: {
          isRequired: true,
          min: 1,
          max: 10,
        },
        defaultValue: 5,
        ui: { description: 'Your personal rating (1–10)' },
      }),
      imageURL: text({
        validation: { isRequired: false },
        ui: { description: 'URL to the noodle image' },
      }),
      reviewsCount: integer({
        validation: {
          isRequired: true
        },
        defaultValue: 0,
        ui: { description: 'Number of noodle reviews' },
        hooks: {
          validate: ({ operation, item, resolvedData, addValidationError }) => {
            if (operation === 'delete') {
              return;
            }

            if (!resolvedData.reviewsCount) {
              return;
            }

            if (operation === 'create') {
              if (resolvedData.reviewsCount < 0) {
                return addValidationError(
                  `Reviews count field cannot be negative`,
                );
              }
              return;
            }

            const newReviewsCount = resolvedData.reviewsCount;
            if (typeof newReviewsCount !== 'number') {
              return;
            }

            const currentCount = item.reviewsCount;

            if (newReviewsCount < currentCount) {
              return addValidationError(
                `Reviews count field cannot be decreased`,
              );
            }

            // Opting for replacing reviews count with the provided input value
            // this allows admins to set the reviewsCount value as they see fit while customers can only increment by 1
            //
            // A more restrictive approach would be to make all calls to increment
            // the existing value by one regardless of the value is passed in
            

            resolvedData.reviewsCount = newReviewsCount;
          },
          beforeOperation: ({ resolvedData }) => {
            const newReviewsCount = resolvedData?.reviewsCount;
            if (newReviewsCount && typeof newReviewsCount === 'number') {
              resolvedData.lastReviewedAt = new Date();
            }
          },
        },
      }),
      lastReviewedAt: timestamp(),
      category: relationship({
        ref: 'Category.noodles',
        many: false,
        ui: { displayMode: 'select' },
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Category: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      noodles: relationship({ ref: 'InstantNoodle.category', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
}; satisfies Lists


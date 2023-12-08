import { z } from 'zod';

import { PublicationMainFocus } from './PublicationMainFocus.js';
import { PublicationSchemaId } from './PublicationSchemaId.js';
import {
  AnyMedia,
  AnyMediaSchema,
  MarketplaceMetadata,
  PublicationMetadataCommon,
  mainContentFocus,
  metadataDetailsWith,
  publicationWith,
} from './common';
import {
  EncryptableDateTime,
  EncryptableMarkdown,
  EncryptableURI,
  Signature,
  encryptableDateTimeSchema,
  encryptableMarkdownSchema,
  encryptableUriSchema,
  nonEmptyStringSchema,
} from '../primitives.js';

export type SpaceMetadataDetails = PublicationMetadataCommon & {
  /**
   * The main focus of the publication.
   */
  mainContentFocus: PublicationMainFocus.SPACE;
  /**
   * The space title.
   */
  title: string;
  /**
   * The space join link.
   */
  link: EncryptableURI;
  /**
   * The space start time (ISO 8601 `YYYY-MM-DDTHH:mm:ss.sssZ`).
   */
  startsAt: EncryptableDateTime;
  /**
   * Optional markdown content.
   */
  content?: EncryptableMarkdown;
  /**
   * The other attachments you want to include with it.
   */
  attachments?: AnyMedia[];
};

export const SpaceMetadataDetailsSchema: z.ZodType<SpaceMetadataDetails, z.ZodTypeDef, object> =
  metadataDetailsWith({
    mainContentFocus: mainContentFocus(PublicationMainFocus.SPACE),

    title: nonEmptyStringSchema().describe('The space title.'),

    link: encryptableUriSchema('The space join link.'),

    startsAt: encryptableDateTimeSchema(
      'The space start time (ISO 8601 `YYYY-MM-DDTHH:mm:ss.sssZ`).',
    ),

    content: encryptableMarkdownSchema('Optional markdown content.').optional(),

    attachments: AnyMediaSchema.array()
      .min(1)
      .optional()
      .describe('The other attachments you want to include with it.'),
  });

/**
 * Use this to notify your community about a space you are hosting.
 */
export type SpaceMetadata = MarketplaceMetadata & {
  /**
   * The schema id.
   */
  $schema: PublicationSchemaId.SPACE_LATEST | PublicationSchemaId.SPACE_3_0_0;
  /**
   * The metadata details.
   */
  lens: SpaceMetadataDetails;
  /**
   * A cryptographic signature of the `lens` data.
   *
   * @experimental DO NOT use yet
   */
  signature?: Signature;
};

/**
 * @internal
 */
export const SpaceSchema: z.ZodType<SpaceMetadata, z.ZodTypeDef, object> = publicationWith({
  $schema: z.union([
    z.literal(PublicationSchemaId.SPACE_LATEST),
    z.literal(PublicationSchemaId.SPACE_3_0_0),
  ]),
  lens: SpaceMetadataDetailsSchema,
});

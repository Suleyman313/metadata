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
  EncryptableMarkdown,
  EncryptableURI,
  Signature,
  encryptableMarkdownSchema,
  encryptableUriSchema,
} from '../primitives.js';

export type LinkMetadataDetails = PublicationMetadataCommon & {
  /**
   * The main focus of the publication.
   */
  mainContentFocus: PublicationMainFocus.LINK;
  /**
   * The sharing link url.
   */
  sharingLink: EncryptableURI;
  /**
   * Optional markdown content.
   */
  content?: EncryptableMarkdown;
  /**
   * The other attachments you want to include with it.
   */
  attachments?: AnyMedia[];
};

const LinkMetadataDetailsSchema: z.ZodType<LinkMetadataDetails, z.ZodTypeDef, object> =
  metadataDetailsWith({
    mainContentFocus: mainContentFocus(PublicationMainFocus.LINK),

    sharingLink: encryptableUriSchema('The sharing link url.'),

    content: encryptableMarkdownSchema('Optional markdown content.').optional(),

    attachments: AnyMediaSchema.array()
      .min(1)
      .optional()
      .describe('The other attachments you want to include with it.'),
  });

/**
 * Use this to share a link to something you want to share.
 */
export type LinkMetadata = MarketplaceMetadata & {
  /**
   * The schema id.
   */
  $schema: PublicationSchemaId.LINK_LATEST | PublicationSchemaId.LINK_3_0_0;
  /**
   * The metadata details.
   */
  lens: LinkMetadataDetails;
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
export const LinkSchema: z.ZodType<LinkMetadata, z.ZodTypeDef, object> = publicationWith({
  $schema: z.union([
    z.literal(PublicationSchemaId.LINK_LATEST),
    z.literal(PublicationSchemaId.LINK_3_0_0),
  ]),
  lens: LinkMetadataDetailsSchema,
});

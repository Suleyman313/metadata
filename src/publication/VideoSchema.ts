import { z } from 'zod';

import { PublicationMainFocus } from './PublicationMainFocus.js';
import { PublicationSchemaId } from './PublicationSchemaId.js';
import {
  AnyMedia,
  AnyMediaSchema,
  MarketplaceMetadata,
  MediaVideo,
  MediaVideoSchema,
  PublicationMetadataCommon,
  mainContentFocus,
  metadataDetailsWith,
  publicationWith,
} from './common';
import {
  EncryptableMarkdown,
  Signature,
  encryptableMarkdownSchema,
  nonEmptyStringSchema,
} from '../primitives.js';

export type VideoMetadataDetails = PublicationMetadataCommon & {
  /**
   * The main focus of the publication.
   */
  mainContentFocus: PublicationMainFocus.VIDEO | PublicationMainFocus.SHORT_VIDEO;
  /**
   * The video.
   */
  video: MediaVideo;
  /**
   * The optional video title.
   */
  title?: string;
  /**
   * Optional markdown content.
   */
  content?: EncryptableMarkdown;
  /**
   * The other attachments you want to include with it.
   */
  attachments?: AnyMedia[];
};

const VideoMetadataDetailsSchema: z.ZodType<VideoMetadataDetails, z.ZodTypeDef, object> =
  metadataDetailsWith({
    mainContentFocus: mainContentFocus(
      PublicationMainFocus.SHORT_VIDEO,
      PublicationMainFocus.VIDEO,
    ),

    video: MediaVideoSchema,

    title: nonEmptyStringSchema('The optional video title.').optional(),

    content: encryptableMarkdownSchema('Optional markdown content.').optional(),

    attachments: AnyMediaSchema.array()
      .min(1)
      .optional()
      .describe('The other attachments you want to include with it.'),
  });

/**
 * Use this to model a publication where a video is the main focus.
 *
 * Use the `lens.attachments` to include more media.
 */
export type VideoMetadata = MarketplaceMetadata & {
  /**
   * The schema id.
   */
  $schema: PublicationSchemaId.VIDEO_LATEST | PublicationSchemaId.VIDEO_3_0_0;
  /**
   * The metadata details.
   */
  lens: VideoMetadataDetails;
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
export const VideoSchema: z.ZodType<VideoMetadata, z.ZodTypeDef, object> = publicationWith({
  $schema: z.union([
    z.literal(PublicationSchemaId.VIDEO_LATEST),
    z.literal(PublicationSchemaId.VIDEO_3_0_0),
  ]),
  lens: VideoMetadataDetailsSchema,
});

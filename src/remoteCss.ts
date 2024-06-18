/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { parse } from 'node-html-parser';
import { HtmlStyles } from './styles';
import { convertStylesheet } from './parse';
import { createCache } from './cache';

export const CSS_CACHE = createCache({ limit: 30 });

export const fetchStylesheet = async (
  src: string,
  fetchOptions?: RequestInit,
  cache = true
) => {
  let image: string;

  if (cache && CSS_CACHE.get(src)) {
    return CSS_CACHE.get(src);
  } else {
    image = await (await fetch(src, fetchOptions)).text();
  }

  if (!image) {
    throw new Error('Cannot resolve image');
  }

  if (cache) {
    CSS_CACHE.set(src, image);
  }

  return image;
};

export const fetchStylesheets = async (
  html: string,
  fetchOptions?: RequestInit
) => {
  const document = parse(html, { comment: false });

  const stylesheets: HtmlStyles[] = [];

  const promises: Promise<void>[] = document
    .querySelectorAll('link[rel="stylesheet"][href]')
    .map(async (styleNode) => {
      try {
        const styleText = await fetchStylesheet(
          styleNode.getAttribute('href') as string,
          fetchOptions
        );
        if (styleText) {
          stylesheets.push(convertStylesheet(styleText));
        }
      } catch (e) {
        console.error(
          `Unable to get remote CSS file ${styleNode.getAttribute('href')}`,
          e
        );
      }
    });

  try {
    await Promise.all(promises);
  } catch (e) {}

  return stylesheets;
};

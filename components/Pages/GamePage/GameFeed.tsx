import React from 'react';
import Title from '@/components/Title';
import { IGameNewsRoot } from '@/types/steam';

type Props = {
  gameNews: IGameNewsRoot;
};

export const GameFeed = ({ gameNews }: Props) => {
  return (
    <section className="md:pr-8 w-screen md:w-auto px-4 md:px-0">
      <Title tag="h2" className="mb-2 ">
        Game Feed
      </Title>
      {gameNews?.appnews?.newsitems.map((article) => {
        return (
          <article className="mb-6 break-words" key={article.date}>
            <section className="mb-4">
              <h3 className="font-bold text-xl">{article.title}</h3>
              <time className="inline text-sm mb-4">
                {new Date(article.date * 1000).toDateString()}
              </time>
              <p className="pl-2 text-sm inline font-bold">
                by {article.author}
              </p>
            </section>
            <section
              className="news"
              dangerouslySetInnerHTML={{
                __html: article.contents,
              }}
            ></section>
          </article>
        );
      })}
    </section>
  );
};

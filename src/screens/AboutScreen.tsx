import React from 'react';
import { BaseInfoTextScreen, IBaseInfoContent, withNavTitle } from '@cpmech/rncomps';

const content: IBaseInfoContent[] = [
  {
    title: 'First Section',
    paras: [
      'first paragraph of first section',
      'second paragraph of first section',
      'third paragraph of first section',
      'fourth paragraph of first section',
    ],
  },
  {
    title: 'Second Section',
    paras: [
      'first paragraph of second section',
      'second paragraph of second section',
      'third paragraph of second section',
    ],
  },
  {
    title: 'Third Section',
    paras: [
      'first paragraph of third section',
      'second paragraph of third section',
      'third paragraph of third section',
      'fourth paragraph of third section',
      'fifth paragraph of third section',
    ],
  },
];

export const Comp: React.FC = () => <BaseInfoTextScreen content={content} />;

export const AboutScreen = withNavTitle(Comp, 'About');

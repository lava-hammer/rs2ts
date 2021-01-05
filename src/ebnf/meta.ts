
export interface IBNFNode {
  parent?: IBNFNode;
  name: string;
  text?: string;
  children?: IBNFNode[];
  line?: number;
  column?: number;
}

export const ebnfMeta: IBNFNode = {
  name: 'root',
  children: [
    {
      name: 'entry',
    },
    {
      name: 'splitter',
    },
    {
      name: 'rule',
    }
  ]
}
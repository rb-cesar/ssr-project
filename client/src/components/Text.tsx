import { FC, PropsWithChildren } from 'react';

const Text: FC<PropsWithChildren> = ({ children }) => {
  return <p style={{ padding: 0, margin: 0, fontSize: 16, fontFamily: 'sans-serif' }}>{children}</p>;
};

export default Text;

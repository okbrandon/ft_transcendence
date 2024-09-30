import styled from 'styled-components';

export const Container = styled.div`
  align-items: center;
  background: #eeedef;
  display: flex;
  height: 40px;
  justify-content: center;
  position: relative;
  width: 360px;
`;

export const Bar = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  height: 32px;
  left: 0;
  padding: 0 21px;
  position: absolute;
  width: 100%;
`;

export const BarGrey = styled(Bar)`
  background: #ccc;
`;

export const BarPurple = styled(Bar)`
  background: #6000ea;
  color: white;
  clip-path: ${props => props.clipPath};
  transition: clip-path 200ms cubic-bezier(0.4, 0, 0.2, 1);
`;

export const Option = styled.div`
  cursor: pointer;
  line-height: 32px;
  text-align: center;
  width: 33.33%;
`;

export const BarOuter = styled.div`
  clip-path: ${props => props.clipPath};
  height: 32px;
  pointer-events: none;
  transition: clip-path 200ms cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;

  &.left .bar-purple {
    transition-delay: 0;
  }
  &.left {
    transition-delay: 80ms;
  }
  &.right .bar-purple {
    transition-delay: 80ms;
  }
  &.right {
    transition-delay: 0;
  }
`;

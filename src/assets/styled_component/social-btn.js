import styled from "styled-components";

export const Container = styled.span`
  background-color: white;
  border: 1px solid #e0e0e0;
  width: 50px;
  height: 50px;
  position: relative;
  font-weight: 500;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 6px 9px;
  cursor: pointer;
  p {
    display: none;
    position: absolute;
    text-align: center;
    font-size: 0.7rem;
    top: 63px;
    left: -62%;
    width: 100px;
    height: 45px;
    padding-top: 15px;
    background: #fff;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    border-radius: 12px;
    border: #e0e0e0 solid 1px;
    &::after {
      content: "";
      position: absolute;
      border-style: solid;
      border-width: 0 17px 11px;
      border-color: #fff transparent;
      display: block;
      width: 0;
      z-index: 1;
      top: -11px;
      left: 36px;
    }
    &::before {
      content: "";
      position: absolute;
      border-style: solid;
      border-width: 0 17px 11px;
      border-color: #e0e0e0 transparent;
      display: block;
      width: 0;
      z-index: 0;
      top: -12px;
      left: 36px;
    }
  }
  &:hover {
    & p {
      display: block;
    }
  }
`;
export const Logo = styled.img`
  height: 25px;
`;

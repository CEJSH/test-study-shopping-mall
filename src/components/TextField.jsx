import cn from 'classnames';
import React, { useState } from 'react';
import './text.css';

/**
 * placeholder 설정 - 테스트 작성 완료
 * className에 따른 css class 설정 - 테스트 작성 완료
 * 텍스트를 입력할 때마다 onChange 핸들러 호출
 * focus 시 border 스타일 변경
 * focus 시 onFocus 핸들러 호출
 * Enter 키 입력 시 onEnter 핸들러 호출
 */

export default function TextField({ onChange }) {
  const [value, setValue] = useState('');

  const changeValue = ev => {
    setValue(ev.target.value);
    onChange?.(ev.target.value);
  };

  return (
    <input
      type="text"
      placeholder="텍스트를 입력해 주세요."
      onChange={changeValue}
      value={value}
    />
  );
}

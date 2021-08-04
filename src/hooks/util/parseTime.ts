/**
 * 通过 substr 来序列化 UTC 时间
 * @param time UTC 时间
 * @returns
 */
const parseTime = (time: string) => {
  return `${time.substr(0, 10)} ${time.substr(11, 8)}`;
};

export default parseTime;

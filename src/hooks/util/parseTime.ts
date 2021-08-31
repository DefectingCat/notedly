/**
 * 通过 substr 来序列化 UTC 时间
 * @param time UTC 时间
 * @returns
 */
const parseTime = (time: string) => {
  return `${time.substr(0, 10)} ${Number(time.substr(11, 2)) + 8}${time.substr(
    13,
    6
  )}`;
};

export default parseTime;

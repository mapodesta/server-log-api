export function getTodayDate() {
  let date = new Date()

  let day = date.getDate()
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  let finalDate;
  if (month < 10) {
    finalDate = `${day}/0${month}/${year}`;
  } else {
    finalDate = `${day}/${month}/${year}`;
  }
  return finalDate;
}
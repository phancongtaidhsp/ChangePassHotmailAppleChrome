const axiosDefault = require('axios');

const instanceDefault = axiosDefault.create({
  timeout: 15000,
})

const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const splitArrayIntoChunks = (array, numChunks) => {
  const chunkSize = Math.floor(array.length / numChunks); // Kích thước mỗi mảng nhỏ
  const remainder = array.length % numChunks;
  const chunks = [];
  for (let i = 0; i < numChunks; i++) {
    chunks.push(array.slice(i * chunkSize, (i + 1) * chunkSize));
  }
  if (remainder > 0) {
    chunks[chunks.length - 1] = [...chunks[chunks.length - 1], ...array.slice(array.length - remainder)];
  }
  return chunks;
}

const rentPhoneDaisySMS = async (apiKey) => {
  return new Promise((resolve) => {
    var options = {
      method: 'GET',
      url: `https://daisysms.com/stubs/handler_api.php?api_key=${apiKey}&action=getNumber&service=mb&max_price=0.15`,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      }
    };
    instanceDefault.request(options)
      .then(function (response) {
        if (response?.data?.includes("ACCESS_NUMBER")) {
          const textNumbers = response?.data?.split(":");
          resolve({ idDaisySMS: textNumbers?.[1], phoneDaisySMS: textNumbers?.[2]?.substring(1) });
        } else {
          resolve({ idDaisySMS: null, phoneDaisySMS: null });
        }
      }).catch((e) => {
        console.log("error rent phone...");
        console.log(e);
        resolve({ idDaisySMS: null, phoneDaisySMS: null });
      });
  })
}

const getCodeDaisySMS = async (apiKey, idDaisySMS) => {
  return new Promise((resolve) => {
    var options = {
      method: 'GET',
      url: `https://daisysms.com/stubs/handler_api.php?api_key=${apiKey}&action=getStatus&id=${idDaisySMS}&all=1`,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      }
    };
    instanceDefault.request(options)
      .then(function (response) {
        if (response.data && response.data.includes("STATUS_OK:")) {
          let resData = response.data.replace("STATUS_OK:", "");
          let codes = resData.split("+");
          resolve(codes);
        } else {
          resolve([]);
        }
      }).catch((e) => {
        resolve([]);
      });
  })
}

const markAsDoneDaisySMS = async (apiKey, idDaisySMS) => {
  return new Promise((resolve) => {
    var options = {
      method: 'GET',
      url: `https://daisysms.com/stubs/handler_api.php?api_key=${apiKey}&action=setStatus&id=${idDaisySMS}&status=6`,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
      }
    };
    instanceDefault.request(options)
      .then(function (response) {
        resolve(true);
      }).catch((e) => {
        resolve(true);
      });
  })
}

module.exports = {
  delay,
  splitArrayIntoChunks,
  rentPhoneDaisySMS,
  getCodeDaisySMS,
  markAsDoneDaisySMS,
};
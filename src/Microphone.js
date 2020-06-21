function Microphone(_fft) {
  var FFT_SIZE = _fft || 1024;
  this.spectrum = [];
  this.volume = this.vol = 0;
  this.peak_volume = 0;
  var self = this;
  var audioContext = new AudioContext();
  var SAMPLE_RATE = audioContext.sampleRate;

  // это просто проверка браузера на то,
  // поддерживает ли он AudioContext и getUserMedia
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia; //теперь просто ждите запуска микрофона
  window.addEventListener('load', init, false);
  function init() {
    try {
      startMic(new AudioContext());
    } catch (e) {
      console.error(e);
      alert('Web Audio API is not supported in this browser');
    }
  }
  function startMic(context) {
    navigator.getUserMedia({audio: true}, processSound, error);
    function processSound(stream) {
      //анализатор определяет частоту, колебательный сигнал и т. д.
      var analyser = context.createAnalyser();
      analyser.smoothingTimeConstant = 0.2;
      analyser.fftSize = FFT_SIZE;
      var node = context.createScriptProcessor(FFT_SIZE * 2, 1, 1);
      node.onaudioprocess = function () {
        // число битов возвращает массив, а это половина FFT_SIZE
        self.spectrum = new Uint8Array(analyser.frequencyBinCount); // getByteFrequencyData выдаёт амплитуду для каждой ячейки
        analyser.getByteFrequencyData(self.spectrum);
        // getByteTimeDomainData определяет громкость за определённое время
        // analyser.getByteTimeDomainData(self.spectrum);

        self.vol = self.getRMS(self.spectrum);
        // get peak – костыль, если громкость низкая
        if (self.vol > self.peak_volume) self.peak_volume = self.vol;
        self.volume = self.vol;
      };
      var input = context.createMediaStreamSource(stream);
      input.connect(analyser);
      analyser.connect(node);
      node.connect(context.destination);
    }
    function error() {
      console.log(arguments);
    }
  } //////// SOUND UTILITIES ..... потом вставим сюда ещё чего-нибудь....
  return this;
}
export default Microphone;

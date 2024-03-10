# Müslim Bot

Müslim Bot, Discord platformunda kullanılmak üzere tasarlanmış bir bot projedir. Bu bot, İslamiyet ile alakalı komutları içerir ve kullanıcılarına Kuran ayetlerini yazılı ve sesli olarak sunar.

## Komutlar

- **Yazılı Kuran**

  - `/ayet`: Rastgele bir Kuran ayetini yazılı olarak gösterir.
  - `/rastgele-ayet`: Rastgele bir Kuran ayetini yazılı olarak gösterir.

- **Sesli Kuran**

  - `/radyo-dinle`: Kuran'ı sesli olarak dinlemek için bir radyo yayını başlatır.
  - `/sure-dinle`: Belirli bir Kuran surenini sesli olarak dinlemek için kullanılır.

- **Bilgi**
  - `/iftar`: Güncel iftar saatini verir.
  - `/namaz`: Güncel namaz saatlerini verir.
  - `/sahur`: Güncel sahur saatini verir.

## Teknoloji

Bu proje, Node.js ve TypeScript kullanılarak geliştirilmiştir. Node.js, arkasında güçlü bir geliştirici topluluğu bulunan ve hızlı bir şekilde geliştirme yapmayı sağlayan bir JavaScript çalışma zamanıdır. TypeScript ise JavaScript'in tip güvenliğini artıran bir üst küme dilidir. Bu kombinasyon, projenin güvenilirliğini ve sürdürülebilirliğini artırır.

## Nasıl Kullanılır

1. Projeyi kendi bilgisayarınıza klonlayın.
2. Gerekli bağımlılıkları yüklemek için terminalde `npm install` komutunu çalıştırın.
3. Discord botunuzu oluşturun ve bir bot token alın.
4. `.env` dosyası oluşturun ve içine `TOKEN=your_bot_token_here` şeklinde bot tokenınızı ekleyin.
5. Terminalde `npm start` komutunu çalıştırarak botu başlatın.

## Katkılar

Kat Contributionlarınızı memnuniyetle karşılıyoruz! Proje üzerinde çalışmak için bir fikriniz veya öneriniz varsa, lütfen bir issue açın veya bir pull request gönderin.

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Daha fazla bilgi için LICENSE dosyasına göz atabilirsiniz.

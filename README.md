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
4. `.env.development` ve `.env.production` dosyalarını oluşturun ve içlerine aşağıdaki bilgileri ekleyin:

```plaintext
# .env.development

DISCORD_TOKEN=your_discord_token_here
MONGODB_URL=your_mongodb_url_here
NODE_ENV=development
GUILD_ID=your_discord_guild_id_here
CLIENT_ID=your_discord_client_id_here

# .env.production

DISCORD_TOKEN=your_discord_token_here
MONGODB_URL=your_mongodb_url_here
NODE_ENV=production
GUILD_ID=your_discord_guild_id_here
CLIENT_ID=your_discord_client_id_here

5. Terminalde `npm start` komutunu çalıştırarak botu başlatın.
```

## Katkılar

Kat Contributionlarınızı memnuniyetle karşılıyoruz! Proje üzerinde çalışmak için bir fikriniz veya öneriniz varsa, lütfen bir issue açın veya bir pull request gönderin.

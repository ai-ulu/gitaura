# 🤝 GitAura'ya Katkıda Bulunma Rehberi

GitAura'ya katkıda bulunmak istediğiniz için teşekkür ederiz! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 🌟 Katkı Türleri

### 1. 🐛 Bug Raporları

Bir hata bulduysanız:
- GitHub Issues'da yeni bir issue açın
- Hatayı açık ve detaylı bir şekilde tanımlayın
- Hatayı yeniden oluşturma adımlarını ekleyin
- Beklenen ve gerçekleşen davranışı belirtin
- Ekran görüntüleri veya hata mesajları ekleyin

### 2. ✨ Özellik Önerileri

Yeni bir özellik önerisi için:
- GitHub Issues'da "Feature Request" etiketi ile issue açın
- Özelliği detaylı bir şekilde açıklayın
- Kullanım senaryolarını paylaşın
- Varsa mockup veya örnek görseller ekleyin

### 3. 💻 Kod Katkıları

#### Başlamadan Önce

1. Repoyu fork edin
2. Yerel makinenize klonlayın:
   ```bash
   git clone https://github.com/YOUR-USERNAME/gitaura.git
   cd gitaura
   ```
3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
4. Yeni bir branch oluşturun:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Kod Standartları

- **TypeScript** kullanın ve tip güvenliğini sağlayın
- **ESLint** kurallarına uyun
- Anlamlı değişken ve fonksiyon isimleri kullanın
- Karmaşık kodlar için yorum ekleyin
- Responsive tasarıma dikkat edin

#### Commit Mesajları

Conventional Commits formatını kullanın:

```
feat: Yeni özellik ekle
fix: Hata düzeltmesi
docs: Dokümantasyon güncelleme
style: Kod formatı değişikliği
refactor: Kod yeniden yapılandırma
test: Test ekleme veya düzeltme
chore: Yapılandırma değişiklikleri
```

Örnekler:
```
feat: Add dark mode toggle
fix: Resolve API timeout issue
docs: Update installation guide
```

#### Pull Request Süreci

1. Değişikliklerinizi commit edin:
   ```bash
   git add .
   git commit -m "feat: Add amazing feature"
   ```

2. Branch'inizi push edin:
   ```bash
   git push origin feature/your-feature-name
   ```

3. GitHub'da Pull Request açın:
   - Açık ve detaylı bir başlık yazın
   - Değişiklikleri açıklayın
   - İlgili issue'ları referans gösterin (#123)
   - Ekran görüntüleri ekleyin (UI değişiklikleri için)

4. Review sürecini bekleyin:
   - Maintainer'lar değişikliklerinizi inceleyecek
   - Gerekirse düzeltme isteyebilirler
   - Onaylandıktan sonra merge edilecek

### 4. 📝 Dokümantasyon

Dokümantasyon katkıları çok değerlidir:
- README güncellemeleri
- Kod yorumları
- Kullanım örnekleri
- Tutorial'lar
- API dokümantasyonu

### 5. 🌐 Çeviri

Yeni dil desteği eklemek için:
1. `locales.ts` dosyasını inceleyin
2. Yeni dil için çeviri ekleyin
3. Dil seçeneğini UI'a ekleyin
4. Pull Request açın

## 🎯 İyi İlk Katkılar

Yeni başlayanlar için uygun issue'lar `good first issue` etiketi ile işaretlenmiştir. Bu issue'lardan başlamanızı öneririz!

## 📞 İletişim

Sorularınız için:
- GitHub Issues kullanın
- Discussions bölümünde tartışma başlatın
- Email: [email protected] (varsa)

## 🛡️ Davranış Kuralları ve Etik

GitAura topluluğunda hem insanlar hem de ajanlar için geçerli olan etik kurallara önem veriyoruz. Detaylar için [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) dosyasını inceleyin.

## 🤖 Ajan-İnsan İş Birliği

GitAura otonom bir ekosistemdir. Katkıda bulunurken şunları bilmelisiniz:
- PR'larınız **Repair Agent** tarafından otomatik olarak test edilebilir.
- Dokümantasyon önerileriniz **Documentation Agent** tarafından stil kontrolünden geçirilebilir.
- Başarılarınız **Media Agent** tarafından topluluğa duyurulabilir.

## 📄 Lisans

Katkılarınız MIT lisansı altında yayınlanacaktır.

---

**Teşekkürler!** Her katkı, GitAura'yı daha iyi hale getirir. 💜
